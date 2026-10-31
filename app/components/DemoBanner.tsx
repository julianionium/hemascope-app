export default function DemoBanner() {
  return (
    <div
      role="status"
      className="sticky top-0 z-50 flex items-center justify-center gap-2 bg-highlight px-4 py-2 text-center text-sm font-semibold text-background"
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
        <circle cx="8" cy="8" r="6.5" />
        <path d="M8 7.2v4" />
        <path d="M8 4.7v.1" />
      </svg>
      Demo data. Not real measurements.
    </div>
  );
}
