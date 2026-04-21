import { CosmosClient, Container, Database } from "@azure/cosmos";

const endpoint = process.env.COSMOS_ENDPOINT;
const key = process.env.COSMOS_KEY;
const databaseId = process.env.COSMOS_DATABASE ?? "tedcromwell";

if (!endpoint || !key) {
  throw new Error("COSMOS_ENDPOINT and COSMOS_KEY must be set");
}

export const cosmosClient = new CosmosClient({ endpoint, key });
export const db: Database = cosmosClient.database(databaseId);

export const containers = {
  posts: db.container("posts"),
  concerts: db.container("concerts"),
  venues: db.container("venues"),
  trips: db.container("trips"),
  places: db.container("places"),
  resume: db.container("resume"),
} satisfies Record<string, Container>;

export type ContainerName = keyof typeof containers;
