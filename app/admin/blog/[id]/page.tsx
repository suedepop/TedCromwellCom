import { notFound } from "next/navigation";
import PostEditor from "../PostEditor";
import { findPostById } from "@/lib/blog";

export const dynamic = "force-dynamic";

export default async function EditPostPage({ params }: { params: { id: string } }) {
  const post = await findPostById(params.id);
  if (!post) notFound();
  return <PostEditor post={post} />;
}
