import {
  CREW,
  MARKERS,
  PHASES,
  getSeries,
  type CrewId,
  type MarkerDef,
  type Phase,
  type SeriesPoint,
} from "./demo";

export type Status = "within" | "watch" | "elevated";

export const WATCH_SCORE = 0.2;
export const ELEVATED_SCORE = 0.45;
/** Baseline range is the personal mean plus or minus this many standard deviations. */
export const WITHIN_Z = 1.5;
export const ELEVATED_Z = 2.5;
const SCORE_SCALE = 3;

export const SCORE_STATUS_LABEL: Record<Status, string> = {
  within: "Within baseline",
  watch: "Watch",
  elevated: "Elevated",
};

// "Elevated" would be misleading for a marker that moved down, so markers use a direction-neutral label.
export const MARKER_STATUS_LABEL: Record<Status, string> = {
  within: "Within baseline",
  watch: "Watch",
  elevated: "Outside baseline",
};

export const SCORE_EXPLANATION: Record<Status, string> = {
  within: "Readings sit inside this person's own preflight baseline range.",
  watch: "Several markers have moved away from this person's own baseline.",
  elevated: "Many markers are well outside this person's own baseline. This flags a change, it is not a diagnosis.",
};

export type TimelinePoint = SeriesPoint & { score: number };

export function scoreFromZ(z: number[]): number {
  const meanSquare = z.reduce((sum, v) => sum + v * v, 0) / z.length;
  return 1 - Math.exp(-meanSquare / SCORE_SCALE);
}

export function scoreStatus(score: number): Status {
  if (score >= ELEVATED_SCORE) return "elevated";
  if (score >= WATCH_SCORE) return "watch";
  return "within";
}

export function zStatus(z: number): Status {
  const a = Math.abs(z);
  if (a > ELEVATED_Z) return "elevated";
  if (a > WITHIN_Z) return "watch";
  return "within";
}

export function getTimeline(crewId: CrewId): TimelinePoint[] {
  return getSeries(crewId).map((p) => ({ ...p, score: scoreFromZ(p.z) }));
}

/** Points up to and including the end of the chosen phase. */
export function visiblePoints(points: TimelinePoint[], phase: Phase): TimelinePoint[] {
  const last = PHASES.indexOf(phase);
  return points.filter((p) => PHASES.indexOf(p.phase) <= last);
}

export function baselineBand(points: TimelinePoint[]): { min: number; max: number } {
  const pre = points.filter((p) => p.phase === "Preflight").map((p) => p.score);
  return { min: Math.min(...pre), max: Math.max(...pre) };
}

export type MarkerReading = {
  def: MarkerDef;
  value: number;
  z: number;
  status: Status;
  baselineLo: number;
  baselineHi: number;
};

export function getReadings(crewId: CrewId, point: TimelinePoint): MarkerReading[] {
  const crew = CREW.find((c) => c.id === crewId)!;
  return MARKERS.map((def, i) => {
    const mean = def.baselineMean * crew.baselineScale;
    const z = point.z[i];
    return {
      def,
      value: mean + z * def.baselineSd,
      z,
      status: zStatus(z),
      baselineLo: mean - WITHIN_Z * def.baselineSd,
      baselineHi: mean + WITHIN_Z * def.baselineSd,
    };
  });
}

export function getDrivers(readings: MarkerReading[], count = 3): { reading: MarkerReading; share: number }[] {
  const total = readings.reduce((sum, r) => sum + r.z * r.z, 0) || 1;
  return readings
    .map((reading) => ({ reading, share: (reading.z * reading.z) / total }))
    .sort((a, b) => b.share - a.share)
    .slice(0, count);
}

export function formatValue(def: MarkerDef, value: number): string {
  return value.toFixed(def.decimals);
}

export function formatZ(z: number): string {
  return `${z >= 0 ? "+" : "-"}${Math.abs(z).toFixed(2)}`;
}
