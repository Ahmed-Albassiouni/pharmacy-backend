import jwt from 'jsonwebtoken';

const DEFAULT_DEV_JWT_SECRET = 'change_this_dev_jwt_secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

function getJwtSecret() {
  const jwtSecret = String(process.env.JWT_SECRET || '').trim();
  if (jwtSecret) return jwtSecret;

  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET is required in production.');
  }

  return DEFAULT_DEV_JWT_SECRET;
}

export function generateToken(payload) {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token) {
  return jwt.verify(token, getJwtSecret());
}
