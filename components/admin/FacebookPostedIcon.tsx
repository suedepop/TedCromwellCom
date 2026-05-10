interface Props {
  lastPostedAt?: string;
  lastPostedUrl?: string;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function FacebookPostedIcon({ lastPostedAt, lastPostedUrl }: Props) {
  if (!lastPostedAt) return null;
  const title = `Posted to Facebook on ${formatDate(lastPostedAt)}`;
  const icon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-4 h-4"
      aria-hidden="true"
    >
      <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.77l-.44 2.89h-2.33v6.99A10 10 0 0 0 22 12z" />
    </svg>
  );
  if (lastPostedUrl) {
    return (
      <a
        href={lastPostedUrl}
        target="_blank"
        rel="noreferrer"
        title={title}
        aria-label={title}
        className="text-[#1877F2] hover:opacity-80"
      >
        {icon}
      </a>
    );
  }
  return (
    <span title={title} aria-label={title} className="text-[#1877F2]">
      {icon}
    </span>
  );
}
