import PropTypes from "prop-types";
import { useNavigate } from "react-router";
import { useGlobal } from "../../providers/global/useGlobal";
export const TeamCard = ({ team, playersNames, isEditing }) => {
	const { setAllTeams } = useGlobal();
	const navigate = useNavigate();
	console.log(team);
	const deleteTeam = () => {
		setAllTeams((prev) => {
			return prev.filter((t) => t.number !== team.number);
		});
	};
	return (
		<div
			className="team-card"
			onClick={() => {
				navigate(
					`/team/?teamName=${team.name}&teamNumber=${team.number}&dayOfWeek=${
						team.dayOfWeek
					}&gameVersion=${team.gameVersion}&players=${playersNames.join(",")}`
				);
			}}>
			<h2 className="text-2xl font-bold">{team.name}</h2>
			<div className="mt-2 text-gray-600">
				<p>Team #{team.number}</p>
				<p>{team.dayOfWeek}</p>
				<p>{team.gameVersion}</p>
			</div>
			{isEditing && (
				<button
					className="error-btn"
					onClick={(e) => {
						e.stopPropagation();
						deleteTeam();
					}}>
					Delete Team
				</button>
			)}
		</div>
	);
};

TeamCard.propTypes = {
	team: PropTypes.object.isRequired,
	playersNames: PropTypes.array,
	isEditing: PropTypes.bool,
};
