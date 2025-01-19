import PropTypes from "prop-types";
import { useState } from "react";
import { emptyPlayer } from "../../utils/constants/players/emptyPlayer";
import { daysOfWeek } from "../../utils/constants/dates/daysOfWeek";
export const TeamForm = ({
	team,
	players,
	onCancel,
	successButtonText,
	onSuccess,
	onFailure,
}) => {
	const [_teamName, _setTeamName] = useState(team.name || "");
	const [_teamNumber, _setTeamNumber] = useState(team.number || "");
	const [_dayOfWeek, _setDayOfWeek] = useState(team.dayOfWeek || "");
	const [_gameVersion, _setGameVersion] = useState(team.gameVersion || "");
	const [_players, _setPlayers] = useState(players || []);
	return (
		<>
			<div id="team-form">
				<div className="form-group">
					<label htmlFor="teamName">Team Name:</label>
					<input
						type="text"
						id="teamName"
						value={_teamName}
						onChange={(e) => _setTeamName(e.target.value)}
					/>
				</div>
				<div className="form-group">
					<label htmlFor="teamNumber">Team Number:</label>
					<input
						type="text"
						id="teamNumber"
						value={_teamNumber}
						onChange={(e) => _setTeamNumber(e.target.value)}
					/>
				</div>
				<div className="form-group">
					<label htmlFor="dayOfWeek">Day of Week:</label>
					<select
						onChange={(e) => {
							_setDayOfWeek(e.target.value);
						}}
						value={_dayOfWeek}>
						<option>Select Day of Week</option>
						{daysOfWeek.map((day) => (
							<option key={day}>{day}</option>
						))}
					</select>
				</div>
				<div className="form-group">
					<label htmlFor="dayOfWeek">Ruleset:</label>
					<select
						onChange={(e) => {
							_setGameVersion(e.target.value);
						}}
						value={_gameVersion}>
						<option>Select Ruleset</option>
						{["8-Ball", "9-Ball"].map((gameVersion) => (
							<option key={gameVersion}>{gameVersion}</option>
						))}
					</select>
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
						{_players.map((player, index) => (
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
				<div className="form-actions">
					<button
						onClick={() => {
							//check if there are any duplicate names
							const uniqueNames = new Set(players.map((player) => player.name));
							if (uniqueNames.size !== players.length) {
								alert("Two players can't have the same name");
								return;
							}
							const updatedTeam = {
								...team,
								name: _teamName,
								number: _teamNumber,
								dayOfWeek: _dayOfWeek,
								gameVersion: _gameVersion,
							};
							console.log(updatedTeam);
							onSuccess(updatedTeam, _players);
						}}>
						{successButtonText}
					</button>
					<button onClick={() => onCancel()}>Cancel</button>
				</div>
			</div>
		</>
	);
};
TeamForm.propTypes = {
	team: PropTypes.object,
	players: PropTypes.array,
	onCancel: PropTypes.func,
	successButtonText: PropTypes.string,
	onSuccess: PropTypes.func,
	onFailure: PropTypes.func,
};
