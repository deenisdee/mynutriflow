const mercadopago = require('mercadopago');
  
// Configura Mercado Pago
mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN
});
 
module.exports = async (req, res) => {
  // Permite CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { plan, email } = req.body;
    
    // Define preços
    const prices = {
      'premium-monthly': 37,
      'premium-annual': 297
    };
    
    const price = prices[plan] || 37;
    const title = plan === 'premium-annual' 
      ? 'ReceitaFit Premium - Anual' 
      : 'ReceitaFit Premium - Mensal';

    // Cria preferência de pagamento
    const preference = {
      items: [{
        title: title,
        unit_price: price,
        quantity: 1,
        currency_id: 'BRL'
      }],
      payer: {
        email: email
      },
      back_urls: {
        success: `${process.env.VERCEL_URL || 'https://receitafit.app'}/sucesso`,
        failure: `${process.env.VERCEL_URL || 'https://receitafit.app'}/falha`,
        pending: `${process.env.VERCEL_URL || 'https://receitafit.app'}/pendente`
      },
      notification_url: `${process.env.VERCEL_URL || 'https://receitafit.app'}/api/webhook`,
      auto_return: 'approved',
      external_reference: JSON.stringify({
        plan: plan,
        email: email,
        timestamp: Date.now()
      })
    };

    const response = await mercadopago.preferences.create(preference);

    res.status(200).json({
      preferenceId: response.body.id,
      initPoint: response.body.init_point
    });

  } catch (error) {
    console.error('Erro ao criar preferência:', error);
    res.status(500).json({ 
      error: 'Erro ao processar pagamento',
      details: error.message 
    });
  }
};
