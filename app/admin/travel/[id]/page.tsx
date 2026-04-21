import { notFound } from "next/navigation";
import TravelEntryEditor from "../TravelEntryEditor";
import { getTravelEntry } from "@/lib/travel";

export const dynamic = "force-dynamic";

export default async function EditTravelEntryPage({ params }: { params: { id: string } }) {
  const entry = await getTravelEntry(params.id);
  if (!entry) notFound();
  return <TravelEntryEditor entry={entry} />;
}
