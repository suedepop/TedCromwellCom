import { CosmosClient, Container, Database } from "@azure/cosmos";

let _client: CosmosClient | null = null;
let _db: Database | null = null;

function initClient(): CosmosClient {
  if (_client) return _client;
  const endpoint = process.env.COSMOS_ENDPOINT;
  const key = process.env.COSMOS_KEY;
  if (!endpoint || !key) {
    throw new Error("COSMOS_ENDPOINT and COSMOS_KEY must be set");
  }
  _client = new CosmosClient({ endpoint, key });
  return _client;
}

function initDb(): Database {
  if (_db) return _db;
  const databaseId = process.env.COSMOS_DATABASE ?? "tedcromwell";
  _db = initClient().database(databaseId);
  return _db;
}

export const cosmosClient = new Proxy({} as CosmosClient, {
  get: (_t, prop: string | symbol) => {
    const c = initClient();
    const value = (c as unknown as Record<string | symbol, unknown>)[prop];
    return typeof value === "function" ? (value as (...a: unknown[]) => unknown).bind(c) : value;
  },
});

export const db = new Proxy({} as Database, {
  get: (_t, prop: string | symbol) => {
    const d = initDb();
    const value = (d as unknown as Record<string | symbol, unknown>)[prop];
    return typeof value === "function" ? (value as (...a: unknown[]) => unknown).bind(d) : value;
  },
});

export type ContainerName = "posts" | "concerts" | "venues" | "trips" | "places" | "resume";

export const containers = new Proxy({} as Record<ContainerName, Container>, {
  get: (_t, prop: string | symbol) => {
    if (typeof prop !== "string") return undefined;
    return initDb().container(prop);
  },
});
