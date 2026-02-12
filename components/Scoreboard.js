import PropTypes from 'prop-types';

export default function Scoreboard({ teamA, teamB, scoreA, scoreB }) {
  return (
    <div className="flex justify-between items-center text-xl font-bold">
      <div>{teamA}: {scoreA}</div>
      <div>VS</div>
      <div>{teamB}: {scoreB}</div>
    </div>
  );
}

Scoreboard.propTypes = {
  teamA: PropTypes.string.isRequired,
  teamB: PropTypes.string.isRequired,
  scoreA: PropTypes.number.isRequired,
  scoreB: PropTypes.number.isRequired,
};
