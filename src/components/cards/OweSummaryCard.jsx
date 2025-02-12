import PropTypes from "prop-types";
import { useTeam } from "../../providers/team/useTeam";

export const OweSummaryCard = ({ player }) => {
	const { players } = useTeam();
	if (!player.playedMatch && !player.attended) {
		return <></>;
	}
	return (
		<>
			<div key={player.name} className="player-payment-summary">
				<h4 className="player-name">{player.name}</h4>
				<div className="payment-details-grid">
					<div className="payment-detail-item">
						<span className="detail-label">Paid:</span>
						<span className="detail-value">${player.totalPaid.toFixed(2)}</span>
					</div>
					<div className="payment-detail-item">
						<span className="detail-label">Should Have Paid:</span>
						<span className="detail-value">
							${player.totalShouldHavePaid.toFixed(2)}
						</span>
					</div>
					<div
						className={`payment-detail-item balance ${
							player.totalPaid - player.totalShouldHavePaid >= 0
								? "positive"
								: "negative"
						}`}>
						<span className="detail-label">Net:</span>
						<span
							className={`detail-value balance ${
								player.totalPaid > player.totalShouldHavePaid
									? "positive"
									: "negative"
							}`}>
							${(player.totalPaid - player.totalShouldHavePaid).toFixed(2)}
						</span>
					</div>
				</div>

				<ul className="owes-list">
					{(() => {
						const consolidatedDebts = player.owes.reduce((acc, owe) => {
							acc[owe.owedTo] = (acc[owe.owedTo] || 0) + owe.amount;
							return acc;
						}, {});

						// Get debts this player owes to others
						const debts = Object.entries(consolidatedDebts).filter(
							([owedTo, amount]) => owedTo !== player.name && amount > 0
						);

						// Get debts others owe to this player
						const receivables = players.reduce((acc, otherPlayer) => {
							if (otherPlayer.name === player.name) return acc;

							const amount = otherPlayer.owes.reduce(
								(sum, owe) =>
									owe.owedTo === player.name ? sum + owe.amount : sum,
								0
							);

							if (amount > 0) {
								acc.push([otherPlayer.name, amount]);
							}
							return acc;
						}, []);

						if (debts.length === 0 && receivables.length === 0) {
							return;
						}

						return (
							<div>
								{debts.length ? (
									<>
										<h4 className="subtitle">Who {player.name} owes</h4>
										<ul className="default">
											{debts.map(([owedTo, amount], index) => (
												<li key={index} className="owe-item">
													${amount.toFixed(2)} to {owedTo}
												</li>
											))}
										</ul>
									</>
								) : (
									<></>
								)}
								{receivables.length ? (
									<>
										<h4 className="subtitle">Who owes {player.name}</h4>
										<ul className="default">
											{receivables.map(([owedBy, amount], index) => (
												<li key={index} className="owe-item">
													${amount.toFixed(2)} from {owedBy}
												</li>
											))}
										</ul>
									</>
								) : (
									<></>
								)}
							</div>
						);
					})()}
				</ul>
			</div>
		</>
	);
};
OweSummaryCard.propTypes = {
	player: PropTypes.object.isRequired,
};
