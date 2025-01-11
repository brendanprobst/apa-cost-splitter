import { useCosts } from "../../../providers/costs/useCosts";
import { useTeam } from "../../../providers/team/useTeam";

export const PlayerAttendanceView = () => {
	const { players, setPlayers } = useTeam();
	const { assignPayerToCost, assignAmountToCost } = useCosts();
	const togglePlayerPlayedMatch = (name) => {
		setPlayers((prev) =>
			prev.map((player) =>
				player.name === name
					? { ...player, playedMatch: !player.playedMatch, attended: true }
					: player
			)
		);
	};
	const togglePlayerAttended = (name) => {
		setPlayers((prev) =>
			prev.map((player) =>
				player.name === name
					? { ...player, attended: !player.attended }
					: player
			)
		);
	};
	return (
		<div className="player-form">
			<h2 className="form-title">Player Attendance</h2>
			<div className="player-header">
				<span className="player-name">Player Name</span>
				<span className="checkbox-label">Played</span>
				<span className="checkbox-label">Attended</span>
			</div>
			{players.map((player) => (
				<div key={player.name} className="player-item">
					<span className="player-name">{player.name}</span>
					<label className="checkbox-label">
						<input
							type="checkbox"
							checked={player.playedMatch}
							onChange={() => togglePlayerPlayedMatch(player.name)}
							className="checkbox-input"
						/>
						<span className="hidden">Played Match</span>
					</label>
					<label className="checkbox-label">
						<input
							type="checkbox"
							checked={player.attended}
							onChange={() => togglePlayerAttended(player.name)}
							className="checkbox-input"
						/>
						<span className="hidden">Attended</span>
					</label>
				</div>
			))}
			<h3>League Dues</h3>
			<select
				onChange={(e) => assignPayerToCost(e.target.value, "League Dues")}
				className="payer-select">
				<option value="">Who Paid the League Dues?</option>
				{players.map((player) => (
					<option key={player.name} value={player.name}>
						{player.name}
					</option>
				))}
			</select>
			<h3>Table Fees</h3>
			<select
				onChange={(e) => assignPayerToCost(e.target.value, "Table Fees")}
				className="payer-select">
				<option value="">Who Paid the Table Fees?</option>
				{players.map((player) => (
					<option key={player.name} value={player.name}>
						{player.name}
					</option>
				))}
			</select>
			<input
				type="number"
				placeholder="Table Fees Amount"
				onChange={(e) =>
					assignAmountToCost("Table Fees", parseFloat(e.target.value))
				}
			/>
		</div>
	);
};
