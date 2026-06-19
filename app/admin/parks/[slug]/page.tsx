import { notFound } from "next/navigation";
import ParkEditor from "./ParkEditor";
import { getPark } from "@/lib/parks";

export const dynamic = "force-dynamic";

export default async function EditParkPage({ params }: { params: { slug: string } }) {
  const park = await getPark(params.slug);
  if (!park) notFound();
  return <ParkEditor park={park} />;
}
