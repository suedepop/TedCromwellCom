import VinylInfiniteList from "./VinylInfiniteList";
import { listRecords } from "@/lib/records";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Vinyl",
  description: "My record collection — imported from Discogs.",
  path: "/vinyl",
});
export const dynamic = "force-dynamic";

const PAGE_SIZE = 16;

export default async function VinylPage() {
  const all = await listRecords({ sort: "artist" });
  const initial = all.slice(0, PAGE_SIZE);
  return (
    <section className="space-y-8">
      <header>
        <h1 className="font-display text-4xl">Vinyl</h1>
        <p className="text-muted mt-2">{all.length} records in the collection.</p>
      </header>
      {all.length === 0 ? (
        <p className="text-muted">No records yet — run an import from the admin.</p>
      ) : (
        <VinylInfiniteList initialItems={initial} total={all.length} pageSize={PAGE_SIZE} />
      )}
    </section>
  );
}
