import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

// Brackets and inner punctuation (underscore, hyphen) may be backslash-escaped
// because tiptap-markdown escapes them when serializing text. The character
// class allows a leading backslash before each ID character; we strip the
// backslashes after capturing.
const YOUTUBE_MARKER = /@youtube\\?\[([\\A-Za-z0-9_-]{6,30})\\?\]/g;
const INSTAGRAM_MARKER = /@instagram\\?\[((?:p|reel|tv)\/[\\A-Za-z0-9_-]+)\\?\]/g;

function unescapeMarkdown(s: string): string {
  return s.replace(/\\([_-])/g, "$1");
}

function expandMarkers(md: string): string {
  let out = md.replace(YOUTUBE_MARKER, (_, raw) => {
    const id = unescapeMarkdown(raw);
    return `\n\n<div style="position:relative;padding-bottom:56.25%;margin:1.5rem 0;border-radius:0.25rem;overflow:hidden;background:#000"><iframe src="https://www.youtube-nocookie.com/embed/${id}" title="YouTube video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="position:absolute;inset:0;width:100%;height:100%;border:0"></iframe></div>\n\n`;
  });
  out = out.replace(INSTAGRAM_MARKER, (_, raw) => {
    const path = unescapeMarkdown(raw);
    return `\n\n<blockquote class="instagram-media" data-instgrm-permalink="https://www.instagram.com/${path}/" data-instgrm-version="14" style="background:#000;border:0;border-radius:3px;margin:1.5rem auto;max-width:540px;min-width:280px;width:calc(100% - 2px)"><div style="padding:16px"><a href="https://www.instagram.com/${path}/" style="color:#9ca3af;text-decoration:none" target="_blank" rel="noreferrer">View this post on Instagram</a></div></blockquote>\n\n`;
  });
  return out;
}

export default function PostBody({ content }: { content: string }) {
  const expanded = expandMarkers(content);
  const hasInstagram = INSTAGRAM_MARKER.test(content);
  // Reset regex state since .test moves lastIndex on global regexes
  INSTAGRAM_MARKER.lastIndex = 0;
  return (
    <article className="prose prose-invert prose-amber max-w-none">
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw, rehypeHighlight]}>
        {expanded}
      </ReactMarkdown>
      {hasInstagram && (
        <script async src="https://www.instagram.com/embed.js" />
      )}
    </article>
  );
}
