// ============================================
// API DE VALIDAÇÃO DE CÓDIGOS PREMIUM
// Vercel Serverless Function
// ============================================

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Use POST' });
  }

  const { code } = req.body || {};

  if (!code || typeof code !== 'string') {
    return res.status(400).json({ ok: false, error: 'Código ausente' });
  }

  // ✅ CÓDIGOS VÁLIDOS (adicione mais conforme necessário)
  const VALID_CODES = new Map([
    ['684884', 30], 
    ['1310', 0.0001],
    ['TESTE-45P', 30],
    ['FITPR02024', 30],
    ['LANCAMENTO2025', 90],
    ['BETA-TESTER', 365],
  ]);

  const normalized = code.trim().toUpperCase();

  // Log da tentativa
  console.log('[REDEEM]', {
    timestamp: new Date().toISOString(),
    code: normalized,
    success: VALID_CODES.has(normalized),
    ip: req.headers['x-forwarded-for'] || 'unknown'
  });

  // Validação
  if (!VALID_CODES.has(normalized)) {
    return res.status(401).json({ 
      ok: false, 
      error: 'Código inválido ou expirado' 
    });
  }

  // Gera token com expiração
  const expiresInDays = VALID_CODES.get(normalized);
  const now = Date.now();
  const expiresAt = now + (expiresInDays * 24 * 60 * 60 * 1000);
  
  const tokenData = {
    code: normalized,
    activated: now,
    expires: expiresAt
  };
  
  const token = Buffer.from(JSON.stringify(tokenData)).toString('base64');

  // Sucesso
  return res.status(200).json({
    ok: true,
    premium: true,
    token: token,
    expiresInDays: expiresInDays,
    expiresAt: expiresAt,
    message: `Premium ativado por ${expiresInDays} dias!`
  });
}
