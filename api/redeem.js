export default function handler(req, res) {
  // Permite apenas POST
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Use POST" });
  }

  const { code } = req.body || {};

  if (!code || typeof code !== "string") {
    return res.status(400).json({ ok: false, error: "Código ausente" });
  }

  // ✅ Códigos válidos (MVP)
  const VALID_CODES = new Set([
    "684884",
    "TESTE-456",
    "FITPRO2024"
  ]);

  const normalized = code.trim().toUpperCase();

  if (!VALID_CODES.has(normalized)) {
    return res.status(401).json({ ok: false, error: "Código inválido" });
  }

  // ✅ Resposta de sucesso (token simples)
  return res.status(200).json({
    ok: true,
    premium: true,
    token: "token-demo-30d",
    expiresInDays: 30
  });
}
