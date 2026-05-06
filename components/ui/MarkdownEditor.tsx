"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Link } from "@tiptap/extension-link";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableCell } from "@tiptap/extension-table-cell";
import { Markdown } from "tiptap-markdown";
import { useEffect } from "react";
import { youtubeId } from "@/lib/youtube";
import { instagramPath } from "@/lib/instagram";

interface Props {
  value: string;
  onChange: (markdown: string) => void;
}

export default function MarkdownEditor({ value, onChange }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: {} }),
      Link.configure({ openOnClick: false }),
      Table.configure({ resizable: false, HTMLAttributes: { class: "md-table" } }),
      TableRow,
      TableHeader,
      TableCell,
      Markdown.configure({ html: true, tightLists: true, linkify: true, breaks: false }),
    ],
    content: value,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "prose prose-invert max-w-none min-h-[300px] focus:outline-none p-4",
      },
    },
    onUpdate: ({ editor }) => {
      // @ts-expect-error tiptap-markdown augments storage
      const md: string = editor.storage.markdown.getMarkdown();
      onChange(md);
    },
  });

  useEffect(() => {
    if (!editor) return;
    // @ts-expect-error tiptap-markdown augments storage
    const current: string = editor.storage.markdown.getMarkdown();
    if (current !== value) editor.commands.setContent(value);
  }, [value, editor]);

  if (!editor) return null;

  const btn = (active: boolean) =>
    `px-2 py-1 text-xs rounded border ${
      active ? "border-accent text-accent" : "border-border text-muted hover:text-ink"
    }`;

  const inTable = editor.isActive("table");

  return (
    <div className="border border-border rounded bg-surface">
      <div className="flex flex-wrap gap-1 p-2 border-b border-border">
        <button type="button" className={btn(editor.isActive("bold"))} onClick={() => editor.chain().focus().toggleBold().run()}>B</button>
        <button type="button" className={btn(editor.isActive("italic"))} onClick={() => editor.chain().focus().toggleItalic().run()}>I</button>
        <button type="button" className={btn(editor.isActive("heading", { level: 2 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</button>
        <button type="button" className={btn(editor.isActive("heading", { level: 3 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>H3</button>
        <button type="button" className={btn(editor.isActive("blockquote"))} onClick={() => editor.chain().focus().toggleBlockquote().run()}>❝</button>
        <button type="button" className={btn(editor.isActive("codeBlock"))} onClick={() => editor.chain().focus().toggleCodeBlock().run()}>{"</>"}</button>
        <button type="button" className={btn(editor.isActive("bulletList"))} onClick={() => editor.chain().focus().toggleBulletList().run()}>• List</button>
        <button type="button" className={btn(editor.isActive("orderedList"))} onClick={() => editor.chain().focus().toggleOrderedList().run()}>1. List</button>
        <button
          type="button"
          className={btn(editor.isActive("link"))}
          onClick={() => {
            const url = window.prompt("URL");
            if (url) editor.chain().focus().setLink({ href: url }).run();
            else editor.chain().focus().unsetLink().run();
          }}
        >
          Link
        </button>
        <span className="mx-1 border-l border-border" />
        <button
          type="button"
          className={btn(false)}
          onClick={() => {
            const url = window.prompt("YouTube URL (watch, share, embed, or shorts link)");
            if (!url) return;
            const id = youtubeId(url.trim());
            if (!id) {
              alert("Couldn't parse that as a YouTube URL.");
              return;
            }
            // Marker token that PostBody rewrites to a full-width iframe at render time.
            // Wrapped in blank lines so it sits as its own paragraph in markdown.
            editor
              .chain()
              .focus()
              .insertContent({
                type: "paragraph",
                content: [{ type: "text", text: `@youtube[${id}]` }],
              })
              .run();
          }}
          title="Embed a full-width YouTube video"
        >
          ▶ YouTube
        </button>
        <button
          type="button"
          className={btn(false)}
          onClick={() => {
            const url = window.prompt("Instagram post / reel / IGTV URL");
            if (!url) return;
            const path = instagramPath(url.trim());
            if (!path) {
              alert("Couldn't parse that as an Instagram URL.");
              return;
            }
            editor
              .chain()
              .focus()
              .insertContent({
                type: "paragraph",
                content: [{ type: "text", text: `@instagram[${path}]` }],
              })
              .run();
          }}
          title="Embed an Instagram post or reel"
        >
          ◧ Instagram
        </button>
        <button
          type="button"
          className={btn(false)}
          onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
          title="Insert 3×3 table"
        >
          Table
        </button>
        {inTable && (
          <>
            <button type="button" className={btn(false)} onClick={() => editor.chain().focus().addRowAfter().run()} title="Add row">+ Row</button>
            <button type="button" className={btn(false)} onClick={() => editor.chain().focus().addColumnAfter().run()} title="Add column">+ Col</button>
            <button type="button" className={btn(false)} onClick={() => editor.chain().focus().deleteRow().run()} title="Delete row">− Row</button>
            <button type="button" className={btn(false)} onClick={() => editor.chain().focus().deleteColumn().run()} title="Delete column">− Col</button>
            <button type="button" className={btn(false)} onClick={() => editor.chain().focus().deleteTable().run()} title="Delete table">× Table</button>
          </>
        )}
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
