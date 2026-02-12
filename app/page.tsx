"use client";

import { useState, useEffect } from "react";
import Timer from "../components/Timer";
import Scoreboard from "../components/Scoreboard";
import EventModal from "../components/EventModal";
import EventTable from "../components/EventTable";
import LeagueTable from "../components/LeagueTable";
import MatchStats from "../components/MatchStats";
import { formatTime } from "../utils/formatTime";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

/* ================= TYPES ================= */

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

export type GoalEvent = {
  type: "Goal";
  team: string;
  player: string;
  assist?: string;
  goalType: "Open Play" | "Penalty" | "Free Kick" | "Own Goal";
  time: string;
};

export type FoulEvent = {
  type: "Foul";
  team: string;
  player: string;
  foulType?: string;
  card?: "None" | "Yellow" | "Red";
  time: string;
};

export type KickEvent = {
  type: "Corner Kick" | "Goal Kick";
  team: string;
  player: string;
  time: string;
};

export type EventType = GoalEvent | FoulEvent | KickEvent;

/* ================= STATIC DATA ================= */

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

/* ================= COMPONENT ================= */

export default function Home() {
  /* ========= LEAGUE STATE ========= */
  const [leagueTable, setLeagueTable] = useState<Team[]>(() => {
    const saved = typeof window !== "undefined"
      ? localStorage.getItem("leagueTable")
      : null;
    return saved ? JSON.parse(saved) : initialTeams;
  });

  /* ========= MATCH SETUP ========= */
  const [teamA, setTeamA] = useState("");
  const [teamB, setTeamB] = useState("");
  const [matchStarted, setMatchStarted] = useState(false);
  const [matchEnded, setMatchEnded] = useState(false);

  /* ========= MATCH STATE ========= */
  const [events, setEvents] = useState<EventType[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [modalType, setModalType] = useState<string | null>(null);

  /* ========= DERIVED SCORES ========= */
  const scoreA = events.filter(e => e.type === "Goal" && e.team === teamA).length;
  const scoreB = events.filter(e => e.type === "Goal" && e.team === teamB).length;

  /* ========= EFFECTS ========= */
  // Persist league table
  useEffect(() => {
    localStorage.setItem("leagueTable", JSON.stringify(leagueTable));
  }, [leagueTable]);

  // Persist current match state
  useEffect(() => {
    localStorage.setItem(
      "currentMatch",
      JSON.stringify({ teamA, teamB, scoreA, scoreB, events, matchStarted })
    );
  }, [teamA, teamB, scoreA, scoreB, events, matchStarted]);

  /* ========= HANDLERS ========= */
  const handleAddEvent = (data: Omit<EventType, "time">) => {
    const newEvent = { ...data, time: formatTime(currentTime) } as EventType;
    setEvents((prev) => [...prev, newEvent]);
    setModalType(null);
  };

  const updateLeague = () => {
    if (matchEnded) return;

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

    updated.sort((a, b) =>
      b.Pts !== a.Pts ? b.Pts - a.Pts : b.GD !== a.GD ? b.GD - a.GD : b.GF - a.GF
    );

    setLeagueTable(updated);
    setMatchEnded(true);
  };

  const exportPDF = async () => {
    const element = document.getElementById("report");
    if (!element) return;

    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF();
    pdf.addImage(imgData, "PNG", 10, 10, 180, 0);
    pdf.save("match-report.pdf");
  };

  const resetMatch = () => {
    setEvents([]);
    setCurrentTime(0);
    setMatchStarted(false);
    setMatchEnded(false);
    setTeamA("");
    setTeamB("");
    setModalType(null);
  };

  /* ========= RENDER ========= */
  return (
    <div className="p-5 space-y-6">
      {/* MATCH SETUP */}
      {!matchStarted && (
        <div className="border p-5 rounded shadow space-y-4">
          <h2 className="text-xl font-bold">Match Setup</h2>

          <div className="mb-4">
            <label htmlFor="teamASelect" className="block font-medium mb-1">Team A</label>
            <select
              id="teamASelect"
              className="border p-2 w-full rounded"
              value={teamA}
              onChange={(e) => setTeamA(e.target.value)}
            >
              <option value="">Select Team A</option>
              {teamsList.map((team) => (
                <option key={team} value={team}>{team}</option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="teamBSelect" className="block font-medium mb-1">Team B</label>
            <select
              id="teamBSelect"
              className="border p-2 w-full rounded"
              value={teamB}
              onChange={(e) => setTeamB(e.target.value)}
            >
              <option value="">Select Team B</option>
              {teamsList.map((team) => (
                <option key={team} value={team}>{team}</option>
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

      {/* MATCH CONTENT */}
      {matchStarted && (
        <>
          <div id="report" className="space-y-4">
            <h1 className="text-2xl font-bold">THE RECTOR&apos;S LEAGUE</h1>

            <Scoreboard teamA={teamA} teamB={teamB} scoreA={scoreA} scoreB={scoreB} />

            <Timer onTimeUpdate={setCurrentTime} />

            <div className="flex gap-2 flex-wrap mt-2">
              {["Goal", "Foul", "Corner Kick", "Goal Kick"].map((type) => (
                <button
                  key={type}
                  className="bg-indigo-600 text-white px-3 py-1 rounded"
                  onClick={() => setModalType(type)}
                >
                  Add {type}
                </button>
              ))}
            </div>

            <EventTable events={events} />
            <MatchStats events={events} teamA={teamA} teamB={teamB} />

            <div className="flex gap-3 mt-4">
              <button
                disabled={matchEnded}
                className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
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
            className="mt-3 bg-purple-600 text-white px-4 py-2 rounded"
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
