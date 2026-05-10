import { notFound } from "next/navigation";
import { getArtist } from "@/lib/artists";
import ArtistEditor from "./ArtistEditor";

export const dynamic = "force-dynamic";

export default async function AdminArtistDetail({ params }: { params: { slug: string } }) {
  const artist = await getArtist(params.slug);
  if (!artist) notFound();
  return <ArtistEditor artist={artist} />;
}
