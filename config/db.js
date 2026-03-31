import mongoose from 'mongoose';
import logger, { getMongoUri, getSafeMongoUri } from '../utils/logger.js';

const DB_NAME = process.env.DB_NAME || 'pharmacy_db';

async function tryConnect(uri) {
  return mongoose.connect(uri, {
    dbName: DB_NAME,
    serverSelectionTimeoutMS: 15000,
    family: 4, // <--- السطر السحري لحل مشكلة الـ IPv6
  });
}

function buildStandardMongoUri(srvUri) {
  const match = srvUri.match(/^mongodb\+srv:\/\/([^:]+):([^@]+)@([^/]+)\/?([^?]*)\??(.*)$/i);
  if (!match) return null;

  const [, user, password, host, dbNameFromUri, queryString] = match;
  const dbName = dbNameFromUri || DB_NAME;

  const params = new URLSearchParams(queryString || '');
  if (!params.has('tls')) params.set('tls', 'true');
  if (!params.has('authSource')) params.set('authSource', 'admin');
  if (!params.has('retryWrites')) params.set('retryWrites', 'true');
  if (!params.has('w')) params.set('w', 'majority');

  return `mongodb://${user}:${password}@${host}/${dbName}?${params.toString()}`;
}

function logSuccess() {
  console.log('MongoDB Connected Successfully');
  logger.info(`Database: ${DB_NAME}`);
}

export async function connectDB() {
  const rawUri = getMongoUri();

  try {
    await tryConnect(rawUri);
    logSuccess();
    return;
  } catch (error) {
    const safeUri = getSafeMongoUri(rawUri);

    if (safeUri !== rawUri) {
      logger.warn('Retrying MongoDB connection with encoded credentials.');
      try {
        await tryConnect(safeUri);
        logSuccess();
        return;
      } catch (encodedError) {
        if (!encodedError.message.includes('querySrv')) {
          logger.error('MongoDB connection failed:', encodedError.message);
          throw encodedError;
        }
      }
    }

    const standardUri = buildStandardMongoUri(safeUri);
    if (standardUri) {
      logger.warn('Retrying MongoDB connection using non-SRV URI fallback.');
      try {
        await tryConnect(standardUri);
        logSuccess();
        return;
      } catch (fallbackError) {
        logger.error('MongoDB connection failed:', fallbackError.message);
        throw fallbackError;
      }
    }

    logger.error('MongoDB connection failed:', error.message);
    throw error;
  }
}
