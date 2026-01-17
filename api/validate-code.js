const { codes } = require('./webhook');

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
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ 
        valid: false, 
        error: 'Código não fornecido' 
      });
    }

    // Busca código
    const subscription = codes.get(code);

    if (!subscription) {
      return res.status(200).json({ 
        valid: false, 
        error: 'Código inválido' 
      });
    }

    // Verifica se expirou
    if (new Date() > subscription.expiresAt) {
      return res.status(200).json({ 
        valid: false, 
        error: 'Código expirado' 
      });
    }

    // Verifica status
    if (subscription.status !== 'active') {
      return res.status(200).json({ 
        valid: false, 
        error: 'Código inativo' 
      });
    }

    // Código válido!
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
```

---

## 🔐 PASSO 2.4 - Configurar variáveis de ambiente na Vercel

1. **Acesse:** https://vercel.com/seu-usuario/receitafit
2. **Settings** → **Environment Variables**
3. **Adicione:**
```
MP_ACCESS_TOKEN = APP_USR-5895942600750387-011705-2e047434597f9d1fd7424b34e58ab3ea-3139065179
MP_PUBLIC_KEY = APP_USR-e59fa87c-726c-4ca3-abe0-c61e62b28b39
