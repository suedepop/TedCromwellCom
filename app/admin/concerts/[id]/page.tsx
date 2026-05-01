import { notFound } from "next/navigation";
import ConcertEditor from "./ConcertEditor";
import { findConcertById, findConcertsOnSameDateOrVenue } from "@/lib/concerts";
import { concertBandLine } from "@/lib/concertDisplay";
import { listVenues } from "@/lib/venues";

export const dynamic = "force-dynamic";

export default async function EditConcertPage({ params }: { params: { id: string } }) {
  const concert = await findConcertById(params.id);
  if (!concert) notFound();
  const [venues, candidates] = await Promise.all([
    listVenues(),
    findConcertsOnSameDateOrVenue(concert),
  ]);
  const mergeCandidates = candidates.map((c) => ({
    id: c.id,
    label: `${c.date} — ${concertBandLine(c)} @ ${c.venueNameRaw}`,
    sameDateAndVenue: c.date === concert.date && c.venueId === concert.venueId,
  }));
  // Sort: exact dupes (same date+venue) first
  mergeCandidates.sort((a, b) =>
    a.sameDateAndVenue === b.sameDateAndVenue ? 0 : a.sameDateAndVenue ? -1 : 1,
  );
  return <ConcertEditor concert={concert} venues={venues} mergeCandidates={mergeCandidates} />;
}
