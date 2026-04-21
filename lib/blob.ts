import { BlobServiceClient, ContainerClient } from "@azure/storage-blob";
import { randomUUID } from "node:crypto";

const connectionString = process.env.BLOB_CONNECTION_STRING;
if (!connectionString) throw new Error("BLOB_CONNECTION_STRING must be set");

export const blobService = BlobServiceClient.fromConnectionString(connectionString);

export type BlobContainer = "photos" | "stubs" | "blog" | "travel" | "resume";

export function container(name: BlobContainer): ContainerClient {
  return blobService.getContainerClient(name);
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
  return uploadBufferWithName(containerName, buffer, contentType, `${randomUUID()}.${extension.replace(/^\./, "")}`);
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
