import { notFound } from "next/navigation";
import CoasterEditor from "./CoasterEditor";
import { getCoaster } from "@/lib/coasters";
import { listParks } from "@/lib/parks";

export const dynamic = "force-dynamic";

export default async function EditCoasterPage({ params }: { params: { slug: string } }) {
  const coaster = await getCoaster(params.slug);
  if (!coaster) notFound();
  const parks = await listParks();
  return <CoasterEditor coaster={coaster} parks={parks} />;
}
