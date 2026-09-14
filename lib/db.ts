import mongoose from "mongoose";
import { setServers } from "node:dns/promises";

declare global {
  var mongooseCache:
    | {
        connection: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
      }
    | undefined;
}
const cache = (global.mongooseCache ??= { connection: null, promise: null });
export const isDatabaseConfigured = () => Boolean(process.env.MONGODB_URI);
export async function connectDB() {
  if (cache.connection) return cache.connection;
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("Database is not configured.");
  if (!cache.promise) {
    const dnsServers = process.env.MONGODB_DNS_SERVERS?.split(",")
      .map((server) => server.trim())
      .filter(Boolean);
    // Optional process-only workaround for networks that refuse Atlas SRV lookups.
    if (dnsServers?.length) setServers(dnsServers);
    cache.promise = mongoose.connect(uri, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 8000,
      maxPoolSize: 10,
    });
  }
  try {
    cache.connection = await cache.promise;
  } catch {
    cache.promise = null;
    throw new Error("Database connection unavailable.");
  }
  return cache.connection;
}
