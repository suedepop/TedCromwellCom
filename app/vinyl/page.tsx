import RecordCard from "@/components/vinyl/RecordCard";
import { listRecords } from "@/lib/records";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Vinyl",
  description: "My record collection — imported from Discogs.",
  path: "/vinyl",
});
export const dynamic = "force-dynamic";

export default async function VinylPage() {
  const records = await listRecords();
  return (
    <section className="space-y-8">
      <header>
        <h1 className="font-display text-4xl">Vinyl</h1>
        <p className="text-muted mt-2">{records.length} records in the collection.</p>
      </header>
      {records.length === 0 ? (
        <p className="text-muted">No records yet — run an import from the admin.</p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {records.map((r) => (
            <RecordCard key={r.id} record={r} />
          ))}
        </div>
      )}
    </section>
  );
}
