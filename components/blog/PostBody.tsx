import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

export default function PostBody({ content }: { content: string }) {
  return (
    <article className="prose prose-invert prose-amber max-w-none">
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw, rehypeHighlight]}>
        {content}
      </ReactMarkdown>
    </article>
  );
}
