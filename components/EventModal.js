"use client";
import { useState } from "react";

export default function EventModal({ type, teamA, teamB, onSubmit, onClose }) {
  const [team, setTeam] = useState(teamA);
  const [player, setPlayer] = useState("");
  const [assist, setAssist] = useState("");
  const [goalType, setGoalType] = useState("Open Play");
  const [foulType, setFoulType] = useState("Rough Tackle");
  const [card, setCard] = useState("None");
  const [penaltyReason, setPenaltyReason] = useState("Handball");
  const [scored, setScored] = useState(true);

  const handleSubmit = () => {
    if (type === "Penalty Kick") {
      onSubmit({
        type,
        team,
        player,
        reason: penaltyReason,
        scored,
      });
      return;
    }

    onSubmit({
      type,
      team,
      player,
      assist: type === "Goal" ? assist : "",
      goalType: type === "Goal" ? goalType : "",
      foulType: type === "Foul" ? foulType : "",
      card: type === "Foul" ? card : "",
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3>{type}</h3>

        <label>Team</label>
        <select value={team} onChange={(e) => setTeam(e.target.value)}>
          <option>{teamA}</option>
          <option>{teamB}</option>
        </select>

        <label>Player</label>
        <input value={player} onChange={(e) => setPlayer(e.target.value)} />

        {/* GOAL */}
        {type === "Goal" && (
          <>
            <label>Assist</label>
            <input value={assist} onChange={(e) => setAssist(e.target.value)} />

            <label>Goal Type</label>
            <select value={goalType} onChange={(e) => setGoalType(e.target.value)}>
              <option>Open Play</option>
              <option>Free Kick</option>
              <option>Own Goal</option>
            </select>
          </>
        )}

        {/* FOUL */}
        {type === "Foul" && (
          <>
            <label>Foul Type</label>
            <select value={foulType} onChange={(e) => setFoulType(e.target.value)}>
              <option>Rough Tackle</option>
              <option>Handball</option>
              <option>Dangerous Play</option>
              <option>Unsporting Conduct</option>
              <option>Obstruction</option>
            </select>

            <label>Card</label>
            <select value={card} onChange={(e) => setCard(e.target.value)}>
              <option>None</option>
              <option>Yellow</option>
              <option>Red</option>
            </select>
          </>
        )}

        {/* PENALTY */}
        {type === "Penalty Kick" && (
          <>
            <label>Reason</label>
            <select
              value={penaltyReason}
              onChange={(e) => setPenaltyReason(e.target.value)}
            >
              <option>Handball</option>
              <option>Rough Tackle</option>
              <option>Dangerous Play</option>
              <option>Unsporting Conduct</option>
            </select>

            <label>Result</label>
            <select
              value={scored ? "Scored" : "Missed"}
              onChange={(e) => setScored(e.target.value === "Scored")}
            >
              <option>Scored</option>
              <option>Missed</option>
            </select>
          </>
        )}

        <button onClick={handleSubmit}>Confirm</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}
