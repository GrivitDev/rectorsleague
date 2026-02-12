export default function Scoreboard({ teamA, teamB, scoreA, scoreB }) {
  return (
    <h2>
      {teamA} {scoreA} - {scoreB} {teamB}
    </h2>
  );
}
