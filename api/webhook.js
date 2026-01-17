// Gera código único
function generateCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'RFP-';
  
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 4; j++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    if (i < 2) code += '-';
  }
  
  return code;
}

// Salva códigos em memória
const codes = new Map();

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
        
        codes.set(code, {
          email: email,
          plan: plan,
          status: 'active',
          createdAt: new Date(),
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

module.exports.codes = codes;
