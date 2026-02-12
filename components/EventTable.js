export default function EventTable({ events }) {

  const goals = events.filter(e => e.type === "Goal");
  const fouls = events.filter(e => e.type === "Foul");
  const corners = events.filter(e => e.type === "Corner Kick");
  const goalKicks = events.filter(e => e.type === "Goal Kick");

  return (
    <div>

      {/* ================= GOALS TABLE ================= */}
      <h2>Goals</h2>
      <table border="1">
        <thead>
          <tr>
            <th>Time</th>
            <th>Team</th>
            <th>Player</th>
            <th>Assist</th>
            <th>Goal Type</th>
          </tr>
        </thead>
        <tbody>
          {goals.map((event, i) => (
            <tr key={i}>
              <td>{event.time}&apos;</td>
              <td>{event.team}</td>
              <td>{event.player}</td>
              <td>{event.assist}</td>
              <td>{event.goalType}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <br /><br />

      {/* ================= FOULS TABLE ================= */}
      <h2>Fouls</h2>
      <table border="1">
        <thead>
          <tr>
            <th>Time</th>
            <th>Team</th>
            <th>Player</th>
            <th>Foul Type</th>
            <th>Card</th>
          </tr>
        </thead>
        <tbody>
          {fouls.map((event, i) => (
            <tr key={i}>
              <td>{event.time}&apos;</td>
              <td>{event.team}</td>
              <td>{event.player}</td>
              <td>{event.foulType}</td>
              <td>{event.card}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <br /><br />

      {/* ================= CORNER KICKS ================= */}
      <h2>Corner Kicks</h2>
      <table border="1">
        <thead>
          <tr>
            <th>Time</th>
            <th>Team</th>
            <th>Player</th>
          </tr>
        </thead>
        <tbody>
          {corners.map((event, i) => (
            <tr key={i}>
              <td>{event.time}&apos;</td>
              <td>{event.team}</td>
              <td>{event.player}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <br /><br />

      {/* ================= GOAL KICKS ================= */}
      <h2>Free Kicks</h2>
      <table border="1">
        <thead>
          <tr>
            <th>Time</th>
            <th>Team</th>
            <th>Player</th>
          </tr>
        </thead>
        <tbody>
          {goalKicks.map((event, i) => (
            <tr key={i}>
              <td>{event.time}&apos;</td>
              <td>{event.team}</td>
              <td>{event.player}</td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}
