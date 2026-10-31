import StatusBadge from "./StatusBadge";
import { SCORE_EXPLANATION, SCORE_STATUS_LABEL, scoreStatus, type TimelinePoint } from "../data/scoring";
import type { Phase } from "../data/demo";

type Props = { crewName: string; phase: Phase; today: TimelinePoint };

export default function ScoreCard({ crewName, phase, today }: Props) {
  const status = scoreStatus(today.score);
  return (
    <section aria-labelledby="score-heading" className="flex h-full flex-col rounded-2xl bg-card p-6">
      <h2 id="score-heading" className="font-heading text-xl font-medium">
        Immune Deviation Score
      </h2>
      <p className="mt-1 text-sm text-muted">
        {crewName}, {phase.toLowerCase()}, {today.label}
      </p>
      <p className="mt-6 font-mono text-7xl font-bold leading-none text-highlight">
        {today.score.toFixed(2)}
        <span className="ml-2 text-xl font-normal text-muted">/ 1</span>
      </p>
      <div className="mt-6">
        <StatusBadge status={status} label={SCORE_STATUS_LABEL[status]} />
      </div>
      <p className="mt-4 text-base text-white">{SCORE_EXPLANATION[status]}</p>
      <p className="mt-auto pt-6 text-sm text-muted">Deviation from this person&apos;s own preflight baseline.</p>
    </section>
  );
}
