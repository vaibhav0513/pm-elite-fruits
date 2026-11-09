import { MongoClient, type Db } from 'mongodb';

const g = globalThis as unknown as { _mongo?: Promise<MongoClient> };

export async function getDb(): Promise<Db> {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI is not set');
  if (!g._mongo) {
    g._mongo = new MongoClient(uri, { serverSelectionTimeoutMS: 4000 }).connect();
  }
  try {
    const client = await g._mongo;
    return client.db(process.env.MONGODB_DB || 'pmelitefruits');
  } catch (e) {
    g._mongo = undefined; // try again next time
    throw e;
  }
}