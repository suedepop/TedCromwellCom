import type { Setlist } from "@/lib/types";

export default function SetlistBlock({ setlist }: { setlist: Setlist }) {
  return (
    <div className="border-l-2 border-accent pl-4 space-y-2">
      <h3 className="font-display text-2xl">{setlist.artist}</h3>
      {setlist.songs.length === 0 ? (
        <p className="text-muted text-sm italic">No setlist recorded.</p>
      ) : (
        <ol className="space-y-1 text-sm">
          {setlist.songs.map((s) => (
            <li key={s.sortOrder} className="flex gap-2">
              <span className="text-muted w-6 text-right">{s.sortOrder + 1}.</span>
              <span>
                {s.name}
                {s.cover && <span className="text-muted italic"> (cover of {s.cover})</span>}
                {s.tape && <span className="text-muted"> · tape</span>}
                {s.info && <span className="text-muted"> — {s.info}</span>}
              </span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
