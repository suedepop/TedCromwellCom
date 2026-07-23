"use client";
import { useRef, useState } from "react";

export interface UploadResult {
  blobUrl?: string;
  thumbnailUrl?: string;
  contentType?: string;
  /** Set by endpoints that dedup uploads (e.g. /api/travel/[id]/photos).
   *  When true the server did NOT store the file — it was already attached
   *  to the target. */
  duplicate?: boolean;
  existingPhotoId?: string;
  /** Endpoints that atomically append a Photo may return it directly. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  photo?: any;
}

interface Props {
  endpoint: string;
  accept?: string;
  multiple?: boolean;
  onUploaded: (result: UploadResult) => void;
  onBatchDone?: () => void;
  label?: string;
  /** Max concurrent uploads. Default 3. Endpoints that read-modify-write the
   *  same document per upload (e.g. per-photo append) must pass 1 to avoid
   *  losing writes to concurrent appends. */
  concurrency?: number;
  /** When true, disables the dropzone with a hint message. */
  disabled?: boolean;
  disabledHint?: string;
}

interface FileState {
  name: string;
  status: "pending" | "uploading" | "done" | "duplicate" | "error";
  error?: string;
}

export default function UploadDropzone({
  endpoint,
  accept = "image/*,.heic,.heif",
  multiple = false,
  onUploaded,
  onBatchDone,
  label = "Upload",
  concurrency = 3,
  disabled = false,
  disabledHint,
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
      setFiles((prev) =>
        prev.map((f, i) =>
          i === index ? { ...f, status: data.duplicate ? "duplicate" : "done" } : f,
        ),
      );
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
    const workers = Array.from(
      { length: Math.min(Math.max(concurrency, 1), queue.length) },
      async () => {
        while (queue.length) {
          const job = queue.shift();
          if (job) await job();
        }
      },
    );
    await Promise.all(workers);
    setBusy(false);
    onBatchDone?.();
    // Auto-clear succeeded + duplicate rows after a short delay, keep errors visible.
    setTimeout(
      () => setFiles((prev) => prev.filter((f) => f.status === "error")),
      2500,
    );
  }

  function onSelect(list: FileList | null) {
    if (!list || list.length === 0) return;
    runBatch(Array.from(list));
  }

  const pendingCount = files.filter(
    (f) => f.status !== "done" && f.status !== "error" && f.status !== "duplicate",
  ).length;
  const doneCount = files.filter((f) => f.status === "done").length;
  const duplicateCount = files.filter((f) => f.status === "duplicate").length;
  const errorCount = files.filter((f) => f.status === "error").length;

  if (disabled) {
    return (
      <div className="block border-2 border-dashed border-border rounded p-4 text-center text-sm text-muted bg-surface/50">
        {disabledHint ?? label}
      </div>
    );
  }

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
          {duplicateCount > 0 && (
            <span className="text-muted"> ({duplicateCount} duplicate{duplicateCount === 1 ? "" : "s"})</span>
          )}
          {errorCount > 0 && <span className="text-red-400"> ({errorCount} failed)</span>}
        </div>
      ) : files.length > 0 ? (
        <div>
          Uploaded <strong>{doneCount}</strong> of {files.length}
          {duplicateCount > 0 && (
            <span className="text-muted"> · {duplicateCount} duplicate{duplicateCount === 1 ? "" : "s"} skipped</span>
          )}
          {errorCount > 0 && <span className="text-red-400"> · {errorCount} failed</span>}
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
                {f.status === "done"
                  ? "✓"
                  : f.status === "duplicate"
                    ? "⤳ dup"
                    : f.status === "error"
                      ? "✗"
                      : f.status === "uploading"
                        ? "…"
                        : ""}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
