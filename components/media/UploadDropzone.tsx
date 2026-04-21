"use client";
import { useRef, useState } from "react";

export interface UploadResult {
  blobUrl: string;
  thumbnailUrl?: string;
  contentType?: string;
}

interface Props {
  endpoint: string;
  accept?: string;
  multiple?: boolean;
  onUploaded: (result: UploadResult) => void;
  onBatchDone?: () => void;
  label?: string;
}

interface FileState {
  name: string;
  status: "pending" | "uploading" | "done" | "error";
  error?: string;
}

const CONCURRENCY = 3;

export default function UploadDropzone({
  endpoint,
  accept = "image/*,.heic,.heif",
  multiple = false,
  onUploaded,
  onBatchDone,
  label = "Upload",
}: Props) {
  const [busy, setBusy] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [files, setFiles] = useState<FileState[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  async function uploadOne(file: File, index: number): Promise<void> {
    setFiles((prev) => prev.map((f, i) => (i === index ? { ...f, status: "uploading" } : f)));
    const form = new FormData();
    form.append("file", file);
    try {
      const res = await fetch(endpoint, { method: "POST", body: form });
      if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
      const data = (await res.json()) as UploadResult;
      onUploaded(data);
      setFiles((prev) => prev.map((f, i) => (i === index ? { ...f, status: "done" } : f)));
    } catch (e) {
      setFiles((prev) =>
        prev.map((f, i) => (i === index ? { ...f, status: "error", error: (e as Error).message } : f)),
      );
    }
  }

  async function runBatch(list: File[]) {
    setBusy(true);
    setFiles(list.map((f) => ({ name: f.name, status: "pending" })));
    const queue = list.map((file, i) => () => uploadOne(file, i));
    const workers = Array.from({ length: Math.min(CONCURRENCY, queue.length) }, async () => {
      while (queue.length) {
        const job = queue.shift();
        if (job) await job();
      }
    });
    await Promise.all(workers);
    setBusy(false);
    onBatchDone?.();
    // Auto-clear succeeded list after a short delay, keep errors visible
    setTimeout(() => setFiles((prev) => prev.filter((f) => f.status === "error")), 1500);
  }

  function onSelect(list: FileList | null) {
    if (!list || list.length === 0) return;
    runBatch(Array.from(list));
  }

  const pendingCount = files.filter((f) => f.status !== "done" && f.status !== "error").length;
  const doneCount = files.filter((f) => f.status === "done").length;
  const errorCount = files.filter((f) => f.status === "error").length;

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        onSelect(e.dataTransfer.files);
      }}
      className={`block border-2 border-dashed rounded p-4 text-center text-sm transition cursor-pointer ${
        dragOver ? "border-accent bg-surface" : "border-border hover:border-accent"
      }`}
      onClick={() => inputRef.current?.click()}
      role="button"
      tabIndex={0}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={(e) => {
          onSelect(e.target.files);
          e.currentTarget.value = "";
        }}
      />
      {busy ? (
        <div>
          Uploading… <strong>{doneCount}</strong>/{files.length}
          {errorCount > 0 && <span className="text-red-400"> ({errorCount} failed)</span>}
        </div>
      ) : (
        <div>
          {label}
          {multiple && <div className="text-xs text-muted mt-1">Drop multiple files, or click to pick</div>}
        </div>
      )}
      {files.filter((f) => f.status === "error").length > 0 && (
        <ul className="mt-2 text-xs text-red-400 text-left">
          {files
            .filter((f) => f.status === "error")
            .map((f) => (
              <li key={f.name}>
                {f.name}: {f.error}
              </li>
            ))}
        </ul>
      )}
      {busy && pendingCount > 0 && (
        <ul className="mt-2 text-xs text-muted text-left max-h-32 overflow-auto">
          {files.map((f) => (
            <li key={f.name} className="flex justify-between">
              <span className="truncate pr-2">{f.name}</span>
              <span>
                {f.status === "done" ? "✓" : f.status === "error" ? "✗" : f.status === "uploading" ? "…" : ""}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
