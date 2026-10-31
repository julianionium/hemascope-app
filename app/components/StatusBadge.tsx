import type { Status } from "../data/scoring";

const BADGE: Record<Status, string> = {
  within: "border-accent bg-background text-white",
  watch: "border-highlight bg-background text-white",
  elevated: "border-highlight bg-highlight font-bold text-background",
};

const ICON: Record<Status, string> = {
  within: "text-accent",
  watch: "text-highlight",
  elevated: "text-background",
};

function StatusIcon({ status }: { status: Status }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {status === "within" && (
        <>
          <circle cx="8" cy="8" r="6.5" />
          <path d="M5 8.2l2 2 4-4.4" />
        </>
      )}
      {status === "watch" && (
        <>
          <path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" />
          <circle cx="8" cy="8" r="2" />
        </>
      )}
      {status === "elevated" && (
        <>
          <path d="M8 2L15 14H1z" />
          <path d="M8 6.5v3.2" />
          <path d="M8 12v.1" />
        </>
      )}
    </svg>
  );
}

export default function StatusBadge({ status, label }: { status: Status; label: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-sm font-semibold ${BADGE[status]}`}>
      <span className={ICON[status]}>
        <StatusIcon status={status} />
      </span>
      {label}
    </span>
  );
}
