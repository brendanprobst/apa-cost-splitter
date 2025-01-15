import { useCosts } from "../../providers/costs/useCosts";
import { useGlobal } from "../../providers/global/useGlobal";
import { useTeam } from "../../providers/team/useTeam";

export const CostSplitSummaryView = () => {
	const { currentWeek } = useGlobal();
	const { team, players } = useTeam();
	const { costs } = useCosts();
	const leagueZelleEmail = "brooklynqueenspayment@gmail.com";

	const generateOwesString = () => {
		// Generate a concise summary string
		console.log("About to consolidate who owes who");
		console.log(players);

		let summary = "Cost Breakdown\n\n";
		// CRITICAL DON'T LET THIS STRING START WITH A WORD FOLLOWED BY A COLON
		// BLAHBLAH: <-- BAD

		// Loop through each player to build their summary string
		players.forEach((player) => {
			console.log(player, player.totalPaid, player.totalShouldHavePaid);
			let balanceString = `${
				player.totalPaid > player.totalShouldHavePaid
					? "is net owed "
					: "net owes "
			} $${Math.abs(player.totalShouldHavePaid - player.totalPaid).toFixed(
				2
			)}\n`;
			let oweString = `${player.name}: ${balanceString}`;

			// Combine all debts by person owed to, summing up amounts
			const consolidatedDebts = player.owes.reduce((acc, owe) => {
				acc[owe.owedTo] = (acc[owe.owedTo] || 0) + owe.amount;
				return acc;
			}, {});

			// Convert debts object to array of [owedTo, amount] pairs
			const debts = Object.entries(consolidatedDebts);

			// Filter out self-debts and zero amounts
			const realDebts = debts.filter(
				([owedTo, amount]) => owedTo !== player.name && amount > 0
			);

			if (realDebts.length === 0) {
				oweString += "nothing";
			} else {
				// Format each debt as "amount to person"
				oweString += realDebts
					.map(([owedTo, amount]) => `- send ${amount.toFixed(2)} to ${owedTo}`)
					.join("\n");
			}
			if (oweString.indexOf("nothing") === -1) {
				summary += oweString + "\n\n";
			}
		});

		if (summary.trim() === "") {
			throw new Error(
				"No debts to summarize. Please check your cost allocations."
			);
		}
		// if someone owes nothing, remove them from the summary
		return summary;
	};

	const copyWhoOwesWho = () => {
		const message = generateOwesString();
		// Decode URL encoded text if needed
		const decodedMessage = decodeURIComponent(message);
		navigator.clipboard.writeText(decodedMessage).then(
			() => {
				alert("Summary copied to clipboard!");
			},
			(err) => {
				console.error("Could not copy text: ", err);
				alert("Failed to copy to clipboard. Please try again.");
			}
		);
	};

	const handleGenerateZelleMessage = (team, currentWeek) => {
		return `Team Number - ${
			team?.number ? team.number : "Team Number"
		}\nTeam Name - ${team?.name ? team.name : "Team Name"}\nWeek # - ${
			currentWeek ? currentWeek : "Week Number"
		}`;
	};
	const handleCopyZelleMessage = (team, currentWeek) => {
		let message = handleGenerateZelleMessage(team, currentWeek);
		navigator.clipboard.writeText(message).then(
			() => {
				alert("Zelle message copied to clipboard!");
			},
			(err) => {
				console.error("Could not copy text: ", err);
				alert("Failed to copy to clipboard. Please try again.");
			}
		);
	};
	const handleCopyZelleEmail = () => {
		navigator.clipboard.writeText(leagueZelleEmail).then(
			() => {
				alert("Zelle email copied to clipboard!");
			},
			(err) => {
				console.error("Could not copy text: ", err);
				alert("Failed to copy to clipboard. Please try again.");
			}
		);
	};
	return (
		<div className="summary">
			<h2 className="result-title">Result</h2>
			<h3 className="summary-title">Team Dues Info</h3>
			<div className="zelle-info-box">
				<p className="zelle-instructions">
					Please Zelle <span className="zelle-amount">$60</span> to{" "}
					<span className="zelle-email">{leagueZelleEmail}</span>
				</p>
				<p className="zelle-subject-instructions">
					In the subject include:
					<span className="zelle-subject">
						{handleGenerateZelleMessage(team, currentWeek)}
					</span>
				</p>
				<div className="zelle-buttons">
					<button
						className="zelle-copy-btn"
						onClick={() => {
							handleCopyZelleEmail();
						}}>
						Copy Zelle Email
					</button>
					<button
						className="zelle-copy-btn"
						onClick={() => handleCopyZelleMessage(team, currentWeek)}>
						Copy Zelle Subject
					</button>
				</div>
				<p>Please always confirm the week is correct</p>
			</div>
			<button
				onClick={() => copyWhoOwesWho()}
				className="full-width success-btn"
				id="copy-who-owes-who-button">
				Copy Who Owes
			</button>
			<div className="payment-summary">
				<h3 className="summary-title">Payment Summary</h3>
				<div className="payment-grid">
					{players.map((player) => (
						<div key={player.name} className="player-payment-summary">
							<h4 className="player-name">{player.name}</h4>
							<div className="payment-details">
								<div>Paid: ${player.totalPaid.toFixed(2)}</div>
								<div>
									Should Have Paid: ${player.totalShouldHavePaid.toFixed(2)}
								</div>
								<div
									className={`balance ${
										player.totalPaid - player.totalShouldHavePaid >= 0
											? "positive"
											: "negative"
									}`}>
									Balance: $
									{(player.totalPaid - player.totalShouldHavePaid).toFixed(2)}
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
													<h4 className="subtitle">Who to pay</h4>
													{debts.map(([owedTo, amount], index) => (
														<li key={index} className="owe-item">
															${amount.toFixed(2)} to {owedTo}
														</li>
													))}
												</>
											) : (
												<></>
											)}
											{receivables.length ? (
												<>
													<h4 className="subtitle">Who owes you</h4>
													{receivables.map(([owedBy, amount], index) => (
														<li key={index} className="owe-item">
															${amount.toFixed(2)} from {owedBy}
														</li>
													))}
												</>
											) : (
												<></>
											)}
										</div>
									);
								})()}
							</ul>
						</div>
					))}
				</div>
			</div>
			<h3 className="summary-title">Cost Breakdown</h3>
			{costs.map((cost) => (
				<div key={cost.name} className="cost-summary">
					<h4 className="cost-name">{cost.name}</h4>
					<div className="cost-details">Total Cost: ${cost.cost}</div>
					<div className="cost-details">Paid By: {cost.paidBy}</div>
					<div className="cost-details">
						Shared By: {cost.sharedBy.join(", ")}
					</div>
					<div className="cost-details">
						Split Amount: ${(cost.cost / cost.sharedBy.length).toFixed(2)}
					</div>
				</div>
			))}
		</div>
	);
};
