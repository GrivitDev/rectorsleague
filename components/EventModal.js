"use client";
import { useState, useEffect } from "react";

/**
 * @typedef {Object} Props
 * @property {string} type
 * @property {string} teamA
 * @property {string} teamB
 * @property {(data: any) => void} onSubmit
 * @property {() => void} onClose
 */

export default function EventModal({ type, teamA, teamB, onSubmit, onClose }) {
  const [team, setTeam] = useState(teamA || teamB);
  const [player, setPlayer] = useState("");
  const [assist, setAssist] = useState("");
  const [goalType, setGoalType] = useState<"Open Play" | "Penalty" | "Free Kick" | "Own Goal">("Open Play");
  const [foulType, setFoulType] = useState("Rough Tackle");
  const [card, setCard] = useState<"None" | "Yellow" | "Red">("None");

  useEffect(() => setTeam(teamA || teamB), [teamA, teamB]);

  const handleSubmit = () => {
    if (!team || !player.trim()) {
      alert("Please select a team and enter a player name.");
      return;
    }

    const payload = { type, team, player };

    if (type === "Goal") {
      payload.assist = assist || undefined;
      payload.goalType = goalType;
    }

    if (type === "Foul") {
      payload.foulType = foulType;
      payload.card = card;
    }

    onSubmit(payload);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3>{type} Event</h3>

        <label>Team</label>
        <select value={team} onChange={(e) => setTeam(e.target.value)}>
          <option value={teamA}>{teamA}</option>
          <option value={teamB}>{teamB}</option>
        </select>

        <br /><br />

        <label>Player</label>
        <input value={player} onChange={(e) => setPlayer(e.target.value)} />

        {type === "Goal" && (
          <>
            <br /><br />
            <label>Assist</label>
            <input value={assist} onChange={(e) => setAssist(e.target.value)} />

            <br /><br />
            <label>Goal Type</label>
            <select value={goalType} onChange={(e) => setGoalType(e.target.value)}>
              <option>Open Play</option>
              <option>Penalty</option>
              <option>Free Kick</option>
              <option>Own Goal</option>
            </select>
          </>
        )}

        {type === "Foul" && (
          <>
            <br /><br />
            <label>Foul Type</label>
            <select value={foulType} onChange={(e) => setFoulType(e.target.value)}>
              <option>Rough Tackle</option>
              <option>Handball</option>
              <option>Dangerous Play</option>
              <option>Unsporting Conduct</option>
              <option>Obstruction</option>
            </select>

            <br /><br />
            <label>Card</label>
            <select value={card} onChange={(e) => setCard(e.target.value)}>
              <option>None</option>
              <option>Yellow</option>
              <option>Red</option>
            </select>
          </>
        )}

        <br /><br />
        <button onClick={handleSubmit}>Confirm</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}
