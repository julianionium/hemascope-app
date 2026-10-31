"use client";

import { useMemo, useState } from "react";
import StatusBadge from "./StatusBadge";
import { MARKER_STATUS_LABEL, formatValue, formatZ, type MarkerReading } from "../data/scoring";

type SortDir = "none" | "desc" | "asc";

const NEXT_DIR: Record<SortDir, SortDir> = { none: "desc", desc: "asc", asc: "none" };
const ARIA_SORT = { none: "none", desc: "descending", asc: "ascending" } as const;
const ARROW: Record<SortDir, string> = { none: "↕", desc: "↓", asc: "↑" };

export default function MarkersTable({ readings }: { readings: MarkerReading[] }) {
  const [dir, setDir] = useState<SortDir>("none");

  const rows = useMemo(() => {
    if (dir === "none") return readings;
    const sign = dir === "desc" ? -1 : 1;
    return [...readings].sort((a, b) => sign * (Math.abs(a.z) - Math.abs(b.z)));
  }, [readings, dir]);

  return (
    <section aria-labelledby="markers-heading" className="rounded-2xl bg-card p-6">
      <h2 id="markers-heading" className="font-heading text-xl font-medium">
        Blood and serum markers
      </h2>
      <p className="mt-1 text-sm text-muted">
        Z-score is the distance from this person&apos;s own baseline mean, in standard deviations. Sort it to rank markers by size of deviation.
      </p>

      <div tabIndex={0} role="region" aria-label="Markers table, scrolls sideways on small screens" className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-left text-base">
          <thead>
            <tr className="border-b border-white/25 text-sm text-muted">
              <th scope="col" className="py-2 pr-4 font-semibold">Marker</th>
              <th scope="col" className="py-2 pr-4 font-semibold">Latest value</th>
              <th scope="col" className="py-2 pr-4 font-semibold">Unit</th>
              <th scope="col" className="py-2 pr-4 font-semibold">Personal baseline range</th>
              <th scope="col" aria-sort={ARIA_SORT[dir]} className="py-2 pr-4 font-semibold">
                <button
                  type="button"
                  onClick={() => setDir(NEXT_DIR[dir])}
                  className="inline-flex items-center gap-1 rounded font-semibold text-white hover:underline"
                >
                  Z-score <span aria-hidden="true">{ARROW[dir]}</span>
                  <span className="sr-only">, sort by size of deviation</span>
                </button>
              </th>
              <th scope="col" className="py-2 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.def.id} className="border-b border-white/15 last:border-0">
                <th scope="row" className="py-3 pr-4 font-semibold">
                  {r.def.name}
                  <span className="block text-xs font-normal text-muted">
                    Earth reference {r.def.earthRef[0]} to {r.def.earthRef[1]}
                  </span>
                </th>
                <td className="py-3 pr-4 font-mono font-bold">{formatValue(r.def, r.value)}</td>
                <td className="py-3 pr-4 font-mono text-muted">{r.def.unit}</td>
                <td className="py-3 pr-4 font-mono">
                  {formatValue(r.def, r.baselineLo)} to {formatValue(r.def, r.baselineHi)}
                </td>
                <td className="py-3 pr-4 font-mono">
                  <span aria-hidden="true">{r.z >= 0 ? "▲" : "▼"} </span>
                  {formatZ(r.z)}
                  <span className="sr-only">{r.z >= 0 ? ", above baseline" : ", below baseline"}</span>
                </td>
                <td className="py-3">
                  <StatusBadge status={r.status} label={MARKER_STATUS_LABEL[r.status]} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
