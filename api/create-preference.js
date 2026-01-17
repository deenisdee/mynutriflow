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
     
    const prices = {
      'premium-monthly': 5,
      'premium-annual': 5
    };
    
    const price = prices[plan] || 37;
    const title = plan === 'premium-annual' 
      ? 'ReceitaFit Premium - Anual' 
      : 'ReceitaFit Premium - Mensal';

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
        success: `https://receitafit-app.vercel.app/sucesso`,
        failure: `https://receitafit-app.vercel.app/falha`,
        pending: `https://receitafit-app.vercel.app/pendente`
      },
      notification_url: `https://receitafit-app.vercel.app/api/webhook`,
      auto_return: 'approved',
      external_reference: JSON.stringify({
        plan: plan,
        email: email,
        timestamp: Date.now()
      })
    };

    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.MP_ACCESS_TOKEN}`
      },
      body: JSON.stringify(preference)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erro ao criar preferência');
    }

    res.status(200).json({
      preferenceId: data.id,
      initPoint: data.init_point
    });

  } catch (error) {
    console.error('Erro:', error);
    res.status(500).json({ 
      error: 'Erro ao processar pagamento',
      details: error.message 
    });
  }
};
