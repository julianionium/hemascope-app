"use client";

import { useEffect, useRef, useState } from "react";
import { PHASES } from "../data/demo";
import { ELEVATED_SCORE, WATCH_SCORE, type TimelinePoint } from "../data/scoring";

type Props = {
  points: TimelinePoint[];
  visibleCount: number;
  band: { min: number; max: number };
};

const HEIGHT = 260;
const M = { l: 40, r: 12, t: 30, b: 32 };
const GRID = [0, 0.25, 0.5, 0.75, 1];

export default function TimelineChart({ points, visibleCount, band }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(640);
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setWidth(Math.max(280, Math.round(entry.contentRect.width))));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const n = points.length;
  const pw = width - M.l - M.r;
  const ph = HEIGHT - M.t - M.b;
  const step = pw / (n - 1);
  const x = (i: number) => M.l + i * step;
  const y = (v: number) => M.t + (1 - v) * ph;

  const visible = points.slice(0, visibleCount);
  const todayIdx = visibleCount - 1;
  const shownIdx = active ?? todayIdx;
  const shown = points[shownIdx];
  const line = visible.map((p, i) => `${i === 0 ? "M" : "L"}${x(p.index)} ${y(p.score)}`).join(" ");

  const regions = PHASES.map((phase) => {
    const idx = points.filter((p) => p.phase === phase).map((p) => p.index);
    const first = idx[0];
    const last = idx[idx.length - 1];
    return {
      phase,
      first,
      last,
      x0: first === 0 ? M.l : (x(first - 1) + x(first)) / 2,
      x1: last === n - 1 ? M.l + pw : (x(last) + x(last + 1)) / 2,
    };
  });
  const flight = regions[1];
  const ticks = [
    { i: 0, anchor: "start" as const },
    { i: flight.first, anchor: "middle" as const },
    { i: flight.last, anchor: "middle" as const },
    { i: n - 1, anchor: "end" as const },
  ];

  const indexFromPointer = (e: React.PointerEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const raw = Math.round((e.clientX - rect.left - M.l) / step);
    return Math.min(todayIdx, Math.max(0, raw));
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft") setActive(Math.max(0, shownIdx - 1));
    else if (e.key === "ArrowRight") setActive(Math.min(todayIdx, shownIdx + 1));
    else if (e.key === "Home") setActive(0);
    else if (e.key === "End") setActive(todayIdx);
    else if (e.key === "Escape") setActive(null);
    else return;
    e.preventDefault();
  };

  const todayX = x(todayIdx);

  return (
    <section aria-labelledby="timeline-heading" className="flex h-full flex-col rounded-2xl bg-card p-6">
      <h2 id="timeline-heading" className="font-heading text-xl font-medium">
        Score timeline
      </h2>
      <p aria-live="polite" className="mt-1 font-mono text-sm text-white">
        {shown.label} ({shown.phase}
        {shownIdx === todayIdx ? ", today" : ""}): score {shown.score.toFixed(2)}
      </p>

      <div
        ref={wrapRef}
        tabIndex={0}
        role="group"
        aria-label="Score timeline. Use the left and right arrow keys to inspect each reading."
        onKeyDown={onKeyDown}
        className="mt-3 rounded-lg bg-background"
      >
        <svg
          width={width}
          height={HEIGHT}
          role="img"
          aria-label={`Immune Deviation Score from ${points[0].label} to ${visible[todayIdx].label}. Latest score ${points[todayIdx].score.toFixed(2)}.`}
          style={{ touchAction: "pan-y", display: "block" }}
          onPointerDown={(e) => setActive(indexFromPointer(e))}
          onPointerMove={(e) => setActive(indexFromPointer(e))}
          onPointerLeave={(e) => {
            if (e.pointerType === "mouse") setActive(null);
          }}
        >
          {regions.map((r, i) => (
            <g key={r.phase}>
              {i % 2 === 1 && <rect x={r.x0} y={M.t} width={r.x1 - r.x0} height={ph} fill="#FFFFFF" fillOpacity="0.06" />}
              <text x={r.x0 + 6} y={M.t - 10} fontSize="12" fontWeight="600" fill="#CFE6FB">
                {r.phase}
              </text>
            </g>
          ))}

          {GRID.map((g) => (
            <g key={g}>
              <line x1={M.l} x2={M.l + pw} y1={y(g)} y2={y(g)} stroke="#CFE6FB" strokeOpacity="0.18" />
              <text x={M.l - 8} y={y(g) + 4} fontSize="11" textAnchor="end" fill="#CFE6FB" fontFamily="var(--font-jetbrains-mono), monospace">
                {g.toFixed(2)}
              </text>
            </g>
          ))}

          {[
            { v: WATCH_SCORE, label: "Watch" },
            { v: ELEVATED_SCORE, label: "Elevated" },
          ].map((t) => (
            <g key={t.label}>
              <line x1={M.l} x2={M.l + pw} y1={y(t.v)} y2={y(t.v)} stroke="#FF8A3D" strokeOpacity="0.7" strokeDasharray="4 4" />
              <text x={M.l + 4} y={y(t.v) - 4} fontSize="11" fill="#CFE6FB">
                {t.label} {t.v.toFixed(2)}
              </text>
            </g>
          ))}

          <rect x={M.l} y={y(band.max)} width={pw} height={Math.max(2, y(band.min) - y(band.max))} fill="#2E96F5" fillOpacity="0.28" stroke="#2E96F5" strokeDasharray="2 3" />

          {ticks.map((t) => (
            <text key={t.i} x={x(t.i)} y={HEIGHT - 10} fontSize="11" textAnchor={t.anchor} fill="#CFE6FB" fontFamily="var(--font-jetbrains-mono), monospace">
              {points[t.i].label}
            </text>
          ))}

          <path d={line} fill="none" stroke="#2E96F5" strokeWidth="2.5" strokeLinejoin="round" />
          {visible.map((p) => (
            <circle key={p.index} cx={x(p.index)} cy={y(p.score)} r="3" fill="#07173F" stroke="#2E96F5" strokeWidth="1.5" />
          ))}

          {active !== null && (
            <g>
              <line x1={x(active)} x2={x(active)} y1={M.t} y2={M.t + ph} stroke="#FFFFFF" strokeOpacity="0.5" />
              <circle cx={x(active)} cy={y(points[active].score)} r="6" fill="none" stroke="#FFFFFF" strokeWidth="2" />
            </g>
          )}

          <circle cx={todayX} cy={y(points[todayIdx].score)} r="7" fill="#FF8A3D" stroke="#FFFFFF" strokeWidth="2" />
          <text x={todayX} y={y(points[todayIdx].score) - 14} fontSize="12" fontWeight="700" textAnchor={todayX > width - 60 ? "end" : "middle"} fill="#FFFFFF">
            Today
          </text>
        </svg>
      </div>

      <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
        <li className="flex items-center gap-2">
          <svg width="22" height="10" aria-hidden="true">
            <line x1="0" x2="22" y1="5" y2="5" stroke="#2E96F5" strokeWidth="2.5" />
          </svg>
          Score
        </li>
        <li className="flex items-center gap-2">
          <svg width="22" height="12" aria-hidden="true">
            <rect x="0.5" y="1.5" width="21" height="9" fill="#2E96F5" fillOpacity="0.28" stroke="#2E96F5" strokeDasharray="2 3" />
          </svg>
          This person&apos;s preflight baseline range
        </li>
        <li className="flex items-center gap-2">
          <svg width="14" height="14" aria-hidden="true">
            <circle cx="7" cy="7" r="5.5" fill="#FF8A3D" stroke="#FFFFFF" strokeWidth="1.5" />
          </svg>
          Today&apos;s reading
        </li>
      </ul>
      <p className="mt-3 text-sm text-muted">L-n: days before launch. FD: flight day. R+n: days after return. Hover, tap, or use arrow keys to see exact values.</p>
    </section>
  );
}
