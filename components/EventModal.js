"use client";
import { useState } from "react";

export default function EventModal({ type, teamA, teamB, onSubmit, onClose }) {
  const [team, setTeam] = useState(teamA);
  const [player, setPlayer] = useState("");
  const [assist, setAssist] = useState("");
  const [goalType, setGoalType] = useState("Open Play");
  const [foulType, setFoulType] = useState("Rough Tackle");
  const [card, setCard] = useState("None");

  const handleSubmit = () => {
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
        <h3>{type} Event</h3>

        <label>Team</label>
        <select value={team} onChange={(e) => setTeam(e.target.value)}>
          <option>{teamA}</option>
          <option>{teamB}</option>
        </select>

        <br /><br />

        <label>Player</label>
        <input value={player} onChange={(e) => setPlayer(e.target.value)} />

        {/* GOAL OPTIONS */}
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

        {/* FOUL OPTIONS */}
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
