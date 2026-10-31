// All data in this file is made up for the demo. It is not from any real person
// or from the NASA OSDR or ImmPort datasets.

export type CrewId = "A" | "B" | "C" | "D";
export type Phase = "Preflight" | "In flight" | "Postflight";

export const PHASES: readonly Phase[] = ["Preflight", "In flight", "Postflight"];

export type CrewMember = {
  id: CrewId;
  name: string;
  /** How strongly this person's markers respond to spaceflight. */
  responseAmplitude: number;
  /** Scales baseline means so each person has their own range. */
  baselineScale: number;
};

export const CREW: readonly CrewMember[] = [
  { id: "A", name: "Crew A", responseAmplitude: 1.0, baselineScale: 1.0 },
  { id: "B", name: "Crew B", responseAmplitude: 0.5, baselineScale: 0.96 },
  { id: "C", name: "Crew C", responseAmplitude: 1.6, baselineScale: 1.04 },
  { id: "D", name: "Crew D", responseAmplitude: 0.8, baselineScale: 1.01 },
];

export type MarkerDef = {
  id: string;
  name: string;
  unit: string;
  decimals: number;
  /** Typical preflight mean before the per-person scale is applied. */
  baselineMean: number;
  baselineSd: number;
  /** Typical healthy Earth reference range, low and high. */
  earthRef: readonly [number, number];
  /** Direction and relative size of this marker's response to flight. */
  flightLoading: number;
};

export const MARKERS: readonly MarkerDef[] = [
  { id: "wbc", name: "WBC", unit: "10^9/L", decimals: 1, baselineMean: 6.2, baselineSd: 0.8, earthRef: [4.0, 10.0], flightLoading: 0.8 },
  { id: "lymph", name: "Lymphocytes", unit: "10^9/L", decimals: 2, baselineMean: 2.0, baselineSd: 0.3, earthRef: [1.0, 3.5], flightLoading: -1.0 },
  { id: "neut", name: "Neutrophils", unit: "10^9/L", decimals: 1, baselineMean: 3.6, baselineSd: 0.6, earthRef: [1.8, 7.0], flightLoading: 1.2 },
  { id: "hgb", name: "Hemoglobin", unit: "g/dL", decimals: 1, baselineMean: 14.2, baselineSd: 0.5, earthRef: [12.0, 17.5], flightLoading: -0.6 },
  { id: "plt", name: "Platelets", unit: "10^9/L", decimals: 0, baselineMean: 245, baselineSd: 25, earthRef: [150, 400], flightLoading: 0.5 },
  { id: "crp", name: "CRP", unit: "mg/L", decimals: 1, baselineMean: 1.2, baselineSd: 0.5, earthRef: [0, 3.0], flightLoading: 1.5 },
  { id: "il6", name: "IL-6", unit: "pg/mL", decimals: 1, baselineMean: 1.8, baselineSd: 0.6, earthRef: [0, 7.0], flightLoading: 1.8 },
  { id: "tnfa", name: "TNF-alpha", unit: "pg/mL", decimals: 1, baselineMean: 2.4, baselineSd: 0.5, earthRef: [0, 8.0], flightLoading: 1.3 },
];

/** Share of each flight shift treated as an expected spaceflight effect. */
export const EXPECTED_FLIGHT_FRACTION = 0.2;

/** Size of the random-looking variation around each person's baseline, in z units. */
const NOISE_Z = 0.9;

export type SeriesPoint = {
  index: number;
  phase: Phase;
  /** Days before launch (negative), flight day, or days after return. */
  day: number;
  label: string;
  /** Z-score per marker, in the same order as MARKERS. */
  z: number[];
};

const SCHEDULE: readonly { phase: Phase; days: readonly number[] }[] = [
  { phase: "Preflight", days: [-90, -80, -70, -60, -50, -40, -30, -20, -10, -3] },
  { phase: "In flight", days: [1, 2, 3, 5, 7, 9, 11, 14] },
  { phase: "Postflight", days: [1, 3, 7, 14, 21, 30] },
];

function inFlightShape(day: number): number {
  return Math.min(1, day / 5) * (1 - 0.015 * Math.max(0, day - 5));
}

/** 0 on the ground before flight, ramps up in flight, decays after return. */
function flightShape(phase: Phase, day: number): number {
  if (phase === "Preflight") return 0;
  if (phase === "In flight") return inFlightShape(day);
  return inFlightShape(14) * Math.exp(-day / 9);
}

/** Deterministic pseudo-random value in [-1, 1], so the demo looks the same every load. */
function noise(a: number, b: number, c: number): number {
  const x = Math.sin(a * 127.1 + b * 311.7 + c * 74.7) * 43758.5453;
  return (x - Math.floor(x)) * 2 - 1;
}

function dayLabel(phase: Phase, day: number): string {
  if (phase === "Preflight") return `L${day}`;
  if (phase === "In flight") return `FD${day}`;
  return `R+${day}`;
}

export function getSeries(crewId: CrewId): SeriesPoint[] {
  const crewIndex = CREW.findIndex((c) => c.id === crewId);
  const crew = CREW[crewIndex];
  const points: SeriesPoint[] = [];
  let index = 0;
  for (const { phase, days } of SCHEDULE) {
    for (const day of days) {
      const shift = (1 - EXPECTED_FLIGHT_FRACTION) * flightShape(phase, day) * crew.responseAmplitude;
      const z = MARKERS.map(
        (m, mi) => NOISE_Z * noise(crewIndex, index, mi) + shift * m.flightLoading,
      );
      points.push({ index, phase, day, label: dayLabel(phase, day), z });
      index++;
    }
  }
  return points;
}
