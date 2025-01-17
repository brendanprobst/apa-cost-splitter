import { useEffect, useState } from "react";
import { useTeam } from "../../providers/team/useTeam";
import { emptyPlayer } from "../../utils/constants/players/emptyPlayer";
import PropTypes from "prop-types";
import { pushStateToUrl } from "../../utils/functions/localStorage/pushStateToUrl";
// import { updatePersistentTeamData } from "../../utils/functions/localStorage/updatePersistentTeamData";

export const ManageTeamModal = ({ isOpen, setIsOpen }) => {
	const { team, setTeam, players, setPlayers } = useTeam();
	const [_teamName, _setTeamName] = useState("");
	const [_teamNumber, _setTeamNumber] = useState("");
	const [_players, _setPlayers] = useState([]);

	useEffect(() => {
		_setTeamName(team.name);
		_setTeamNumber(team.number);
		_setPlayers(players);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isOpen]);

	const handleSaveTeam = () => {
		const filteredPlayers = _players.filter(
			(player) => player.name.trim() !== ""
		);
		pushStateToUrl(_teamName, _teamNumber, filteredPlayers);
		setTeam({
			name: _teamName,
			number: _teamNumber,
		});
		setPlayers(filteredPlayers);

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
				<div className="form-group">
					<label htmlFor="teamNumber">Team Number:</label>
					<input
						type="text"
						id="teamNumber"
						value={_teamNumber ? _teamNumber : ""}
						onChange={(e) => _setTeamNumber(e.target.value)}
					/>
				</div>
				<div className="form-group">
					<label htmlFor="teamName">Team Name:</label>
					<input
						type="text"
						id="teamName"
						value={_teamName ? _teamName : ""}
						onChange={(e) => _setTeamName(e.target.value)}
					/>
				</div>

				<div className="form-group player-list">
					<div className="flex justify-between items-end mb-4">
						<label className="mb-0">Players:</label>
						<button
							className="success-btn"
							onClick={() => {
								_setPlayers(
									_players
										? [..._players, { ...emptyPlayer, name: "" }]
										: [...players, { ...emptyPlayer, name: "" }]
								);
							}}>
							Add Player
						</button>
					</div>

					<div>
						{(_players ? _players : players).map((player, index) => (
							<div key={index} className="player-input">
								<input
									type="text"
									value={player.name}
									onChange={(e) => {
										const updatedPlayers = [..._players];
										updatedPlayers[index].name = e.target.value;
										_setPlayers(updatedPlayers);
									}}
								/>
								<button
									onClick={() => {
										_setPlayers(_players.filter((_, i) => i !== index));
									}}>
									Remove
								</button>
							</div>
						))}
					</div>
				</div>

				<div className="modal-actions">
					<button
						onClick={() => {
							//check if there are any duplicate names
							const uniqueNames = new Set(players.map((player) => player.name));
							if (uniqueNames.size !== players.length) {
								alert("Two players can't have the same name");
								return;
							}
							handleSaveTeam();
						}}>
						Save
					</button>
					<button onClick={() => handleCancel()}>Cancel</button>
				</div>
			</div>
		</div>
	);
};
ManageTeamModal.propTypes = {
	isOpen: PropTypes.bool,
	setIsOpen: PropTypes.func.isRequired,
};
