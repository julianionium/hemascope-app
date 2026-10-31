import { formatZ, type MarkerReading } from "../data/scoring";

type Driver = { reading: MarkerReading; share: number };

export default function DriversPanel({ drivers }: { drivers: Driver[] }) {
  return (
    <section aria-labelledby="drivers-heading" className="h-full rounded-2xl bg-card p-6">
      <h2 id="drivers-heading" className="font-heading text-xl font-medium">
        What is driving this score
      </h2>
      <p className="mt-1 text-sm text-muted">Top 3 markers by share of the total deviation.</p>
      <ol className="mt-5 space-y-5">
        {drivers.map(({ reading, share }) => {
          const pct = Math.round(share * 100);
          return (
            <li key={reading.def.id}>
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-semibold">{reading.def.name}</span>
                <span className="font-mono text-sm">
                  {pct}%<span className="text-muted">, z {formatZ(reading.z)}</span>
                </span>
              </div>
              <div className="mt-2 h-3 rounded-full bg-background" role="img" aria-label={`${reading.def.name} accounts for ${pct}% of the deviation`}>
                <div className="h-3 rounded-full bg-highlight" style={{ width: `${Math.max(pct, 2)}%` }} />
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
