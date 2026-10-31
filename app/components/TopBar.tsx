import { CREW, PHASES, type CrewId, type Phase } from "../data/demo";

type Props = {
  crewId: CrewId;
  phase: Phase;
  onCrewChange: (id: CrewId) => void;
  onPhaseChange: (phase: Phase) => void;
};

export default function TopBar({ crewId, phase, onCrewChange, onPhaseChange }: Props) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <h1 className="font-heading text-3xl font-bold tracking-tight">HemaScope</h1>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="flex flex-col gap-1">
          <label htmlFor="crew" className="text-sm text-muted">
            Crew member
          </label>
          <select
            id="crew"
            value={crewId}
            onChange={(e) => onCrewChange(e.target.value as CrewId)}
            className="h-11 rounded-lg border border-white/30 bg-card px-3 text-base text-white [color-scheme:dark]"
          >
            {CREW.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <span id="phase-label" className="text-sm text-muted">
            Mission phase
          </span>
          <div role="group" aria-labelledby="phase-label" className="flex gap-2">
            {PHASES.map((p) => (
              <button
                key={p}
                type="button"
                aria-pressed={p === phase}
                onClick={() => onPhaseChange(p)}
                className={`h-11 flex-1 rounded-lg border px-3 text-sm font-semibold sm:flex-none ${
                  p === phase ? "border-button bg-button text-white" : "border-white/30 bg-transparent text-white hover:bg-white/10"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
