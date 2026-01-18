module.exports = async (req, res) => {
  res.status(200).json({
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID || 'NOT_FOUND',
    FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL || 'NOT_FOUND',
    FIREBASE_PRIVATE_KEY_EXISTS: !!process.env.FIREBASE_PRIVATE_KEY,
    FIREBASE_PRIVATE_KEY_LENGTH: process.env.FIREBASE_PRIVATE_KEY?.length || 0,
    MP_ACCESS_TOKEN_EXISTS: !!process.env.MP_ACCESS_TOKEN
  });
};
