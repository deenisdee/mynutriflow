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
  
  // ✅ CÓDIGOS VÁLIDOS - CORRIGIDO
  const VALID_CODES = new Map([
    ['teste10s', 0.0001157],        // 10 segundos
    ['teste1m', 0.0006944],    // 1 minuto
    ['684884', 30],           // 30 dias
    ['G8A8B4', 30],           // 30 dias
    ['TESTE-45P', 30],        // 30 dias
    ['FITPR02024', 30],       // 30 dias
    ['LANCAMENTO2026', 90],   // 90 dias
    ['BETA-TESTER', 365],     // 1 ano
  ]);
  
  // ✅ NORMALIZA O CÓDIGO
  const normalized = code.trim().toUpperCase();
  
  // ✅ LOG
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
