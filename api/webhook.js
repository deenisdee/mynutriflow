const admin = require('firebase-admin');

// Inicializa Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
    })
  });
}

const db = admin.firestore();

// Gera código único
function generateCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'VFP-'; // VeganFit Premium
  
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 4; j++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    if (i < 2) code += '-';
  }
  
  return code;
}

module.exports = async (req, res) => {
  try {
    const { type, data } = req.body;

    console.log('Webhook recebido:', { type, data });

    if (type === 'payment') {
      const paymentResponse = await fetch(
        `https://api.mercadopago.com/v1/payments/${data.id}`,
        {
          headers: {
            'Authorization': `Bearer ${process.env.MP_ACCESS_TOKEN}`
          }
        }
      );

      const payment = await paymentResponse.json();
      
      console.log('Status do pagamento:', payment.status);

      if (payment.status === 'approved') {
        const externalRef = JSON.parse(payment.external_reference);
        const email = externalRef.email;
        const plan = externalRef.plan;
        
        const code = generateCode();
        
        const expiresAt = plan === 'premium-annual'
          ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
          : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        
        // Salva no Firestore
        await db.collection('premium_codes').doc(code).set({
          email: email,
          plan: plan,
          status: 'active',
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          expiresAt: expiresAt,
          paymentId: payment.id
        });

        console.log(`
========================================
NOVO PAGAMENTO APROVADO!
Email: ${email}
Plano: ${plan}
Código: ${code}
Válido até: ${expiresAt.toLocaleDateString('pt-BR')}
========================================
        `);
      }
    }

    res.status(200).json({ received: true });

  } catch (error) {
    console.error('Erro no webhook:', error);
    res.status(500).json({ error: error.message });
  }
};
