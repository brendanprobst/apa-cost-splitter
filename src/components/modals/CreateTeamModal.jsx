import PropTypes from "prop-types";
import { useGlobal } from "../../providers/global/useGlobal";
import { TeamForm } from "../forms/TeamForm";

export const CreateTeamModal = ({ isOpen, setIsOpen }) => {
	const { setAllTeams } = useGlobal();

	const handleSaveTeam = (updatedTeam, players) => {
		console.log("updated", updatedTeam, players);
		const filteredPlayers = players.filter(
			(player) => player.name.trim() !== ""
		);
		const playersNames = filteredPlayers.map((player) => player.name);

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
							number: updatedTeam.number,
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
						number: updatedTeam.number,
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
					team={{}}
					players={[]}
					successButtonText={"Create Team"}
					onSuccess={handleSaveTeam}
					onCancel={handleCancel}
				/>
			</div>
		</div>
	);
};
CreateTeamModal.propTypes = {
	isOpen: PropTypes.bool,
	setIsOpen: PropTypes.func.isRequired,
};
