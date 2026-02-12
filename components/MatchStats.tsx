type Card = "Yellow" | "Red";

type EventType = "Goal" | "Foul" | "Corner Kick" | "Penalty Kick";

interface MatchEvent {
  team: string;
  type: EventType;
  card?: Card;
}

interface MatchStatsProps {
  events: MatchEvent[];
  teamA: string;
  teamB: string;
}

export default function MatchStats({ events, teamA, teamB }: MatchStatsProps) {
  const stats = {
    goals: { A: 0, B: 0 },
    fouls: { A: 0, B: 0 },
    yellow: { A: 0, B: 0 },
    red: { A: 0, B: 0 },
    corners: { A: 0, B: 0 },
    freeKicks: { A: 0, B: 0 },
    penalties: { A: 0, B: 0 },
  };

  events.forEach((e) => {
    const side = e.team === teamA ? "A" : "B";

    if (e.type === "Goal") stats.goals[side]++;
    if (e.type === "Foul") {
      stats.fouls[side]++;
      if (e.card === "Yellow") stats.yellow[side]++;
      if (e.card === "Red") stats.red[side]++;
    }
    if (e.type === "Corner Kick") stats.corners[side]++;
    if (e.type === "Penalty Kick") stats.penalties[side]++;
  });

  return (
    <>
      <h2>Match Statistics</h2>
      <table>
        <thead>
          <tr>
            <th>Statistic</th>
            <th>{teamA}</th>
            <th>{teamB}</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Goals</td><td>{stats.goals.A}</td><td>{stats.goals.B}</td></tr>
          <tr><td>Total Fouls</td><td>{stats.fouls.A}</td><td>{stats.fouls.B}</td></tr>
          <tr><td>Yellow Cards</td><td>{stats.yellow.A}</td><td>{stats.yellow.B}</td></tr>
          <tr><td>Red Cards</td><td>{stats.red.A}</td><td>{stats.red.B}</td></tr>
          <tr><td>Corner Kicks</td><td>{stats.corners.A}</td><td>{stats.corners.B}</td></tr>
          <tr><td>Penalty Kicks</td><td>{stats.penalties.A}</td><td>{stats.penalties.B}</td></tr>
        </tbody>
      </table>
    </>
  );
}
