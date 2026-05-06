import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

const YOUTUBE_MARKER = /@youtube\[([A-Za-z0-9_-]{6,15})\]/g;

function expandYoutubeMarkers(md: string): string {
  return md.replace(
    YOUTUBE_MARKER,
    (_, id) =>
      `\n\n<div style="position:relative;padding-bottom:56.25%;margin:1.5rem 0;border-radius:0.25rem;overflow:hidden;background:#000"><iframe src="https://www.youtube-nocookie.com/embed/${id}" title="YouTube video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="position:absolute;inset:0;width:100%;height:100%;border:0"></iframe></div>\n\n`,
  );
}

export default function PostBody({ content }: { content: string }) {
  const expanded = expandYoutubeMarkers(content);
  return (
    <article className="prose prose-invert prose-amber max-w-none">
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw, rehypeHighlight]}>
        {expanded}
      </ReactMarkdown>
    </article>
  );
}
