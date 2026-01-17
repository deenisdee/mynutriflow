const mercadopago = require('mercadopago');

mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN
});

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

// Salva código (por enquanto em memória, depois vamos usar banco)
const codes = new Map();

module.exports = async (req, res) => {
  try {
    const { type, data } = req.body;

    console.log('Webhook recebido:', { type, data });

    // Só processa notificações de pagamento
    if (type === 'payment') {
      // Busca dados do pagamento
      const payment = await mercadopago.payment.findById(data.id);
      
      console.log('Status do pagamento:', payment.body.status);

      // Se pagamento aprovado
      if (payment.body.status === 'approved') {
        const externalRef = JSON.parse(payment.body.external_reference);
        const email = externalRef.email;
        const plan = externalRef.plan;
        
        // Gera código único
        const code = generateCode();
        
        // Define validade
        const expiresAt = plan === 'premium-annual'
          ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 ano
          : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);  // 30 dias
        
        // Salva código
        codes.set(code, {
          email: email,
          plan: plan,
          status: 'active',
          createdAt: new Date(),
          expiresAt: expiresAt,
          paymentId: payment.body.id
        });

        console.log('Código gerado:', code, 'para', email);

        // TODO: Enviar email com código
        // Por enquanto, vamos só logar
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

// Exporta códigos para validação
module.exports.codes = codes;
