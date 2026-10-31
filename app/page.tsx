import DemoBanner from "./components/DemoBanner";
import Dashboard from "./components/Dashboard";
import SourcesFooter from "./components/SourcesFooter";

export default function Home() {
  return (
    <>
      <DemoBanner />
      <main className="flex-1">
        <Dashboard />
      </main>
      <SourcesFooter />
    </>
  );
}
