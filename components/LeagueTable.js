export default function LeagueTable({ table }) {
  return (
    <>
      <h2>League Table</h2>
      <table>
        <thead>
          <tr>
            <th>Pos</th>
            <th>Team</th>
            <th>P</th>
            <th>W</th>
            <th>D</th>
            <th>L</th>
            <th>GF</th>
            <th>GA</th>
            <th>GD</th>
            <th>Pts</th>
          </tr>
        </thead>
        <tbody>
          {table.map((team, index) => (
            <tr key={team.name}>
              <td>{index + 1}</td>
              <td>{team.name}</td>
              <td>{team.P}</td>
              <td>{team.W}</td>
              <td>{team.D}</td>
              <td>{team.L}</td>
              <td>{team.GF}</td>
              <td>{team.GA}</td>
              <td>{team.GD}</td>
              <td>{team.Pts}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
