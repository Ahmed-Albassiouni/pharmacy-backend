export const DEFAULT_MONGO_URI = 'mongodb://127.0.0.1:27017/pharmacy_db';

const logger = {
  info: (...args) => console.log('[INFO]', ...args),
  warn: (...args) => console.warn('[WARN]', ...args),
  error: (...args) => console.error('[ERROR]', ...args),
};

function sanitizeEnvValue(value) {
  return String(value || '')
    .trim()
    .replace(/^"|"$/g, '');
}

export function getMongoUri() {
  const raw = sanitizeEnvValue(process.env.MONGO_URI);
  if (raw) return raw;

  if (process.env.NODE_ENV === 'production') {
    throw new Error('MONGO_URI is required in production.');
  }

  logger.warn('MONGO_URI is not set. Falling back to local MongoDB URI.');
  return DEFAULT_MONGO_URI;
}

export function getSafeMongoUri(uri) {
  const cleanUri = sanitizeEnvValue(uri);
  if (!cleanUri) return cleanUri;

  const match = cleanUri.match(/^(mongodb(?:\+srv)?:\/\/[^:]+:)([^@]+)(@.+)$/i);
  if (!match) return cleanUri;

  const [, start, rawPassword, end] = match;

  let decodedPassword = rawPassword;
  try {
    decodedPassword = decodeURIComponent(rawPassword);
  } catch {
    decodedPassword = rawPassword;
  }

  const safePassword = encodeURIComponent(decodedPassword);
  return `${start}${safePassword}${end}`;
}

export default logger;
