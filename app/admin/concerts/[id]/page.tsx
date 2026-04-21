import { notFound } from "next/navigation";
import ConcertEditor from "./ConcertEditor";
import { findConcertById } from "@/lib/concerts";
import { listVenues } from "@/lib/venues";

export const dynamic = "force-dynamic";

export default async function EditConcertPage({ params }: { params: { id: string } }) {
  const concert = await findConcertById(params.id);
  if (!concert) notFound();
  const venues = await listVenues();
  return <ConcertEditor concert={concert} venues={venues} />;
}
