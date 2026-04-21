import { notFound } from "next/navigation";
import VenueEditor from "./VenueEditor";
import { getVenue, listVenues } from "@/lib/venues";

export const dynamic = "force-dynamic";

export default async function EditVenuePage({ params }: { params: { id: string } }) {
  const venue = await getVenue(params.id);
  if (!venue) notFound();
  const allVenues = await listVenues();
  return <VenueEditor venue={venue} others={allVenues.filter((v) => v.id !== venue.id)} />;
}
