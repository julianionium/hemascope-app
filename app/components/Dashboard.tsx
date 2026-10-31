"use client";

import { useMemo, useState } from "react";
import { CREW, type CrewId, type Phase } from "../data/demo";
import { baselineBand, getDrivers, getReadings, getTimeline, visiblePoints } from "../data/scoring";
import DriversPanel from "./DriversPanel";
import HowItWorks from "./HowItWorks";
import MarkersTable from "./MarkersTable";
import ScoreCard from "./ScoreCard";
import TimelineChart from "./TimelineChart";
import TopBar from "./TopBar";

export default function Dashboard() {
  const [crewId, setCrewId] = useState<CrewId>("A");
  const [phase, setPhase] = useState<Phase>("In flight");

  const timeline = useMemo(() => getTimeline(crewId), [crewId]);
  const visible = useMemo(() => visiblePoints(timeline, phase), [timeline, phase]);
  const today = visible[visible.length - 1];
  const band = useMemo(() => baselineBand(timeline), [timeline]);
  const readings = useMemo(() => getReadings(crewId, today), [crewId, today]);
  const drivers = useMemo(() => getDrivers(readings), [readings]);
  const crewName = CREW.find((c) => c.id === crewId)!.name;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6">
      <TopBar crewId={crewId} phase={phase} onCrewChange={setCrewId} onPhaseChange={setPhase} />
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <ScoreCard crewName={crewName} phase={phase} today={today} />
        <div className="lg:col-span-2">
          <TimelineChart key={`${crewId}-${phase}`} points={timeline} visibleCount={visible.length} band={band} />
        </div>
        <div className="lg:col-span-3">
          <MarkersTable readings={readings} />
        </div>
        <DriversPanel drivers={drivers} />
        <div className="lg:col-span-2">
          <HowItWorks />
        </div>
      </div>
    </div>
  );
}
