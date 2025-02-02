import PropTypes from "prop-types";
import { useTeam } from "../../providers/team/useTeam";
import { useApp } from "../../providers/app/useApp";
import { TeamForm } from "../forms/TeamForm";
import { pushStateToUrl } from "../../utils/functions/localStorage/pushStateToUrl";
// import { updatePersistentTeamData } from "../../utils/functions/localStorage/updatePersistentTeamData";

export const ManageTeamModal = ({ isOpen, setIsOpen }) => {
	const { team, setTeam, players, setPlayers } = useTeam();
	const { setAllTeams } = useApp();
	// const [_teamName, _setTeamName] = useState("");
	// const [_teamNumber, _setTeamNumber] = useState("");
	// const [_dayOfWeek, _setDayOfWeek] = useState("");
	// const [_gameVersion, _setGameVersion] = useState("");
	// const [_players, _setPlayers] = useState([]);

	// useEffect(() => {
	// 	_setTeamName(team?.name);
	// 	_setTeamNumber(team?.number);
	// 	_setDayOfWeek(team?.dayOfWeek);
	// 	_setGameVersion(team?.gameVersion);
	// 	_setPlayers(players);
	// 	// eslint-disable-next-line react-hooks/exhaustive-deps
	// }, [isOpen]);

	const handleSaveTeam = (updatedTeam, players) => {
		console.log(updatedTeam, players);
		const filteredPlayers = players.filter(
			(player) => player.name.trim() !== ""
		);
		const playersNames = filteredPlayers.map((player) => player.name);
		pushStateToUrl(
			updatedTeam.name,
			updatedTeam.number,
			updatedTeam.dayOfWeek,
			updatedTeam.gameVersion,
			filteredPlayers
		);
		setTeam({
			name: team.name,
			number: updatedTeam.number,
			dayOfWeek: updatedTeam.dayOfWeek,
			gameVersion: updatedTeam.gameVersion,
		});
		setPlayers(filteredPlayers);
		setAllTeams((prev) => {
			// If prev is empty, create new array with just this team
			if (!prev?.length) {
				return [
					{
						number: updatedTeam.number,
						name: updatedTeam.name,
						dayOfWeek: updatedTeam.dayOfWeek,
						gameVersion: updatedTeam.gameVersion,
						players: playersNames,
					},
				];
			}

			// Otherwise update existing team or add as new
			const existingTeam = prev.find(
				(team) => team.number === updatedTeam.number
			);
			if (existingTeam) {
				return prev.map((team) => {
					if (team.number === updatedTeam.number) {
						return {
							...team,
							name: updatedTeam.name,
							dayOfWeek: updatedTeam.dayOfWeek,
							gameVersion: updatedTeam.gameVersion,
							players: playersNames,
						};
					}
					return team;
				});
			} else {
				return [
					...prev,
					{
						number: updatedTeam.teamNumber,
						name: updatedTeam.name,
						dayOfWeek: updatedTeam.dayOfWeek,
						gameVersion: updatedTeam.gameVersion,
						players: playersNames,
					},
				];
			}
		});
		//updatePersistentTeamData(filteredPlayers, _teamName, _teamNumber);
		setIsOpen(false);
	};
	const handleCancel = () => {
		setIsOpen(false);
	};
	if (!isOpen) return <></>;
	return (
		<div className="modal-overlay">
			<div className="modal-content">
				<h2>Manage Team</h2>
				<TeamForm
					team={team}
					players={players}
					successButtonText={"Save"}
					onSuccess={handleSaveTeam}
					onCancel={handleCancel}
				/>
			</div>
		</div>
	);
};
ManageTeamModal.propTypes = {
	isOpen: PropTypes.bool,
	setIsOpen: PropTypes.func.isRequired,
};
