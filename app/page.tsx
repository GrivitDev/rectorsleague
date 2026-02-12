"use client";

import { useState, useEffect } from "react";
import Timer from "../components/Timer";
import Scoreboard from "../components/Scoreboard";
import EventModal from "../components/EventModal";
import EventTable from "../components/EventTable";
import LeagueTable from "../components/LeagueTable";
import { formatTime } from "../utils/formatTime";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import MatchStats from "../components/MatchStats";


// Team type
type Team = {
  name: string;
  P: number;
  W: number;
  D: number;
  L: number;
  GF: number;
  GA: number;
  GD: number;
  Pts: number;
};

// Event types
type GoalEvent = {
  type: "Goal";
  team: string;
  player: string;
  assist?: string;
  goalType: "Open Play" | "Penalty" | "Free Kick";
  time: string;
};

type FoulEvent = {
  type: "Foul";
  team: string;
  player: string;
  foulType?: string;
  card?: "None" | "Yellow" | "Red";
  time: string;
};

type KickEvent = {
  type: "Corner Kick" | "Goal Kick";
  team: string;
  player: string;
  time: string;
};

type PenaltyEvent = {
  type: "Penalty Kick";
  team: string;
  player: string;
  reason: string;
  scored: boolean;
  time: string;
};


type EventType = GoalEvent | FoulEvent | KickEvent| PenaltyEvent;

export default function Home() {
  const teamsList = ["Bison FC", "Bidan FC", "BIM FC", "BIYELU FC", "BIFES FC"];

  const initialTeams: Team[] = teamsList.map((team) => ({
    name: team,
    P: 0,
    W: 0,
    D: 0,
    L: 0,
    GF: 0,
    GA: 0,
    GD: 0,
    Pts: 0,
  }));

  const [leagueTable, setLeagueTable] = useState<Team[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("leagueTable");
      return saved ? JSON.parse(saved) : initialTeams;
    }
    return initialTeams;
  });

  // Match setup
  const [teamA, setTeamA] = useState<string>("");
  const [teamB, setTeamB] = useState<string>("");
  const [matchStarted, setMatchStarted] = useState(false);

  // Match state
  const [events, setEvents] = useState<EventType[]>([]);
  const [scoreA, setScoreA] = useState(0);
  const [scoreB, setScoreB] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [modalType, setModalType] = useState<string | null>(null);

  // Save league table
  useEffect(() => {
    localStorage.setItem("leagueTable", JSON.stringify(leagueTable));
  }, [leagueTable]);

  // Add event
  const handleAddEvent = (data: EventType) => {
    const newEvent = { ...data, time: formatTime(currentTime) };
      if (data.type === "Goal") {
        if (data.team === teamA) setScoreA((prev) => prev + 1);
        else setScoreB((prev) => prev + 1);
      }

      if (data.type === "Penalty Kick" && data.scored) {
        if (data.team === teamA) setScoreA((prev) => prev + 1);
        else setScoreB((prev) => prev + 1);
      }
    setEvents((prev) => [...prev, newEvent]);
    setModalType(null);
  };

  // Update league after match
  const updateLeague = () => {
    const updated = leagueTable.map((team) => {
      if (team.name === teamA || team.name === teamB) {
        const isA = team.name === teamA;
        const goalsFor = isA ? scoreA : scoreB;
        const goalsAgainst = isA ? scoreB : scoreA;

        const t = { ...team };
        t.P += 1;
        t.GF += goalsFor;
        t.GA += goalsAgainst;

        if (goalsFor > goalsAgainst) {
          t.W += 1;
          t.Pts += 3;
        } else if (goalsFor === goalsAgainst) {
          t.D += 1;
          t.Pts += 1;
        } else {
          t.L += 1;
        }

        t.GD = t.GF - t.GA;
        return t;
      }
      return team;
    });

    updated.sort((a, b) => {
      if (b.Pts !== a.Pts) return b.Pts - a.Pts;
      if (b.GD !== a.GD) return b.GD - a.GD;
      return b.GF - a.GF;
    });

    setLeagueTable(updated);
  };

  // Export match report PDF
  const exportPDF = async () => {
    const element = document.getElementById("report");
    if (!element) return;
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF();
    pdf.addImage(imgData, "PNG", 10, 10, 180, 0);
    pdf.save("match-report.pdf");
  };

  // Reset match
  const resetMatch = () => {
    setScoreA(0);
    setScoreB(0);
    setEvents([]);
    setCurrentTime(0);
    setMatchStarted(false);
    setTeamA("");
    setTeamB("");
    setModalType(null);
  };

  return (
    <div className="p-5">
      {/* ===== MATCH SETUP ===== */}
      {!matchStarted && (
        <div className="border p-5 mb-5 rounded shadow">
          <h2 className="text-xl font-bold mb-4">Match Setup</h2>

          <div className="mb-4">
            <label htmlFor="teamASelect" className="block font-medium mb-1">
              Team A
            </label>
            <select
              id="teamASelect"
              className="border p-2 w-full rounded"
              value={teamA}
              onChange={(e) => setTeamA(e.target.value)}
            >
              <option value="">Select Team A</option>
              {teamsList.map((team) => (
                <option key={team} value={team}>
                  {team}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="teamBSelect" className="block font-medium mb-1">
              Team B
            </label>
            <select
              id="teamBSelect"
              className="border p-2 w-full rounded"
              value={teamB}
              onChange={(e) => setTeamB(e.target.value)}
            >
              <option value="">Select Team B</option>
              {teamsList.map((team) => (
                <option key={team} value={team}>
                  {team}
                </option>
              ))}
            </select>
          </div>

          <button
            disabled={!teamA || !teamB || teamA === teamB}
            className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
            onClick={() => setMatchStarted(true)}
          >
            Start Match
          </button>
        </div>
      )}

      {/* ===== MATCH CONTENT ===== */}
      {matchStarted && (
        <>
          <div id="report" className="space-y-4">
            <h1 className="text-2xl font-bold mb-2">THE RECTOR&apos;S LEAGUE</h1>

            <Scoreboard teamA={teamA} teamB={teamB} scoreA={scoreA} scoreB={scoreB} />

            <Timer onTimeUpdate={setCurrentTime} />

            <div className="space-x-2 mt-2">
              <button
                className="bg-green-600 text-white px-3 py-1 rounded"
                onClick={() => setModalType("Goal")}
              >
                Add Goal
              </button>
              <button
                className="bg-red-600 text-white px-3 py-1 rounded"
                onClick={() => setModalType("Foul")}
              >
                Add Foul
              </button>
              <button
                className="bg-yellow-500 text-white px-3 py-1 rounded"
                onClick={() => setModalType("Corner Kick")}
              >
                Add Corner Kick
              </button>
              <button
                className="bg-purple-600 text-white px-3 py-1 rounded"
                onClick={() => setModalType("Goal Kick")}
              >
                Add Free Kick
              </button>
              <button
                className="bg-orange-600 text-white px-3 py-1 rounded"
                onClick={() => setModalType("Penalty Kick")}
              >
                Add Penalty Kick
              </button>

            </div>

            <EventTable events={events} />
            <MatchStats events={events} teamA={teamA} teamB={teamB} />

            <div className="mt-4 space-x-2">
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded"
                onClick={updateLeague}
              >
                End Match & Update League
              </button>
              <button
                className="bg-gray-600 text-white px-4 py-2 rounded"
                onClick={resetMatch}
              >
                New Match
              </button>
            </div>

            <LeagueTable table={leagueTable} />
          </div>

          <button
            className="mt-3 bg-indigo-600 text-white px-4 py-2 rounded"
            onClick={exportPDF}
          >
            Export PDF
          </button>

          {modalType && (
            <EventModal
              type={modalType}
              teamA={teamA}
              teamB={teamB}
              onSubmit={handleAddEvent}
              onClose={() => setModalType(null)}
            />
          )}
        </>
      )}
    </div>
  );
}
