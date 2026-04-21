import { BlobServiceClient, ContainerClient } from "@azure/storage-blob";
import { randomUUID } from "node:crypto";

let _service: BlobServiceClient | null = null;

function getService(): BlobServiceClient {
  if (_service) return _service;
  const connectionString = process.env.BLOB_CONNECTION_STRING;
  if (!connectionString) throw new Error("BLOB_CONNECTION_STRING must be set");
  _service = BlobServiceClient.fromConnectionString(connectionString);
  return _service;
}

export const blobService = new Proxy({} as BlobServiceClient, {
  get: (_t, prop: string | symbol) => {
    const s = getService();
    const value = (s as unknown as Record<string | symbol, unknown>)[prop];
    return typeof value === "function" ? (value as (...a: unknown[]) => unknown).bind(s) : value;
  },
});

export type BlobContainer = "photos" | "stubs" | "blog" | "travel" | "resume";

export function container(name: BlobContainer): ContainerClient {
  return getService().getContainerClient(name);
}

export interface UploadResult {
  blobUrl: string;
  blobName: string;
}

export async function uploadBuffer(
  containerName: BlobContainer,
  buffer: Buffer,
  contentType: string,
  extension: string,
): Promise<UploadResult> {
  return uploadBufferWithName(
    containerName,
    buffer,
    contentType,
    `${randomUUID()}.${extension.replace(/^\./, "")}`,
  );
}

export async function uploadBufferWithName(
  containerName: BlobContainer,
  buffer: Buffer,
  contentType: string,
  blobName: string,
): Promise<UploadResult> {
  const client = container(containerName).getBlockBlobClient(blobName);
  await client.uploadData(buffer, {
    blobHTTPHeaders: { blobContentType: contentType },
  });
  return { blobUrl: client.url, blobName };
}

export async function deleteBlob(containerName: BlobContainer, blobName: string): Promise<void> {
  await container(containerName).deleteBlob(blobName);
}
