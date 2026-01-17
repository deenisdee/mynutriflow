module.exports = async (req, res) => {
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
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ 
        valid: false, 
        error: 'Código não fornecido' 
      });
    }

    // CÓDIGOS HARDCODED PRA TESTE
    const validCodes = {
      'RFP-BLQS-ZDD8-GJA4': {
        email: 'de_nisde@hotmail.com',
        plan: 'premium-monthly',
        status: 'active',
        expiresAt: new Date('2026-02-16')
      },
      'TESTE-1234': {
        email: 'teste@teste.com',
        plan: 'premium-annual',
        status: 'active',
        expiresAt: new Date('2027-01-01')
      }
    };

    const subscription = validCodes[code];

    if (!subscription) {
      return res.status(200).json({ 
        valid: false, 
        error: 'Código inválido' 
      });
    }

    if (new Date() > subscription.expiresAt) {
      return res.status(200).json({ 
        valid: false, 
        error: 'Código expirado' 
      });
    }

    if (subscription.status !== 'active') {
      return res.status(200).json({ 
        valid: false, 
        error: 'Código inativo' 
      });
    }

    res.status(200).json({
      valid: true,
      plan: subscription.plan,
      expiresAt: subscription.expiresAt,
      email: subscription.email
    });

  } catch (error) {
    console.error('Erro ao validar código:', error);
    res.status(500).json({ 
      valid: false,
      error: 'Erro ao validar código' 
    });
  }
};
