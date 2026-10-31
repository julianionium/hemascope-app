const FRAMER_URL = "https://hemascope.framer.website/";

export default function SourcesFooter() {
  return (
    <footer className="mx-auto w-full max-w-6xl px-4 pb-10 pt-4 sm:px-6">
      <div className="flex flex-col gap-6 border-t border-white/20 pt-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="font-heading text-lg font-medium">Data sources</h2>
          <ul className="mt-2 space-y-1 text-sm text-muted">
            <li>NASA OSDR, Inspiration4: OSD-569 (blood counts), OSD-575 (serum panels)</li>
            <li>ImmPort: healthy reference data</li>
          </ul>
          <p className="mt-3 max-w-xl text-sm text-muted">This demo shows made-up numbers. It does not contain data from these sources.</p>
        </div>
        <a
          href={FRAMER_URL}
          className="inline-flex h-11 items-center justify-center rounded-lg bg-button px-5 font-semibold text-white hover:bg-accent hover:text-background"
        >
          How it works
        </a>
      </div>
    </footer>
  );
}
