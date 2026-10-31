import { EXPECTED_FLIGHT_FRACTION } from "../data/demo";
import { ELEVATED_SCORE, WATCH_SCORE, WITHIN_Z } from "../data/scoring";

export default function HowItWorks() {
  return (
    <details className="group h-full rounded-2xl bg-card p-6">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-heading text-xl font-medium">
        How this score works
        <span aria-hidden="true" className="text-muted transition-transform group-open:rotate-180">
          ▼
        </span>
      </summary>
      <div className="mt-4 space-y-3 text-base text-white">
        <p className="font-semibold">This is a demo. Every number on this page is made up.</p>
        <ol className="list-decimal space-y-3 pl-5">
          <li>
            <span className="font-semibold">Own baseline.</span> Each reading is compared with the astronaut&apos;s own preflight readings. The baseline range is their average plus or minus {WITHIN_Z} standard deviations.
          </li>
          <li>
            <span className="font-semibold">Earth reference.</span> Each reading is also compared with a typical healthy Earth reference range, shown under each marker name.
          </li>
          <li>
            <span className="font-semibold">Spaceflight layer.</span> Some changes are expected in flight. This layer adjusts for known flight effects so only the rest counts. In this demo, a fixed {Math.round(EXPECTED_FLIGHT_FRACTION * 100)}% of each flight shift is treated as expected.
          </li>
          <li>
            <span className="font-semibold">One number.</span> The marker deviations are combined into a score from 0 to 1. Under {WATCH_SCORE.toFixed(2)} is within baseline, {WATCH_SCORE.toFixed(2)} to {ELEVATED_SCORE.toFixed(2)} is watch, and above {ELEVATED_SCORE.toFixed(2)} is elevated.
          </li>
        </ol>
        <p className="text-muted">The score shows change from a person&apos;s own baseline. It is not a diagnosis.</p>
      </div>
    </details>
  );
}
