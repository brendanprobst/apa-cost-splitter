import { useCosts } from "../../providers/costs/useCosts";
import { useTeam } from "../../providers/team/useTeam";
import { CostBreakdownCard } from "../cards/CostBreakdownCard";
import { LeagueDuesInfoCard } from "../cards/LeagueDuesInfoCard";
import { OweSummaryCard } from "../cards/OweSummaryCard";
import { Collapsible } from "../ui/Collapsible";

export const CostSplitSummaryView = () => {
	const { players } = useTeam();
	const { costs } = useCosts();

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

	return (
		<div className="summary">
			<button
				onClick={() => copyWhoOwesWho()}
				className="full-width success-btn"
				id="copy-who-owes-who-button">
				Copy Who Owes
			</button>
			<h2 className="result-title">Result</h2>

			<Collapsible title="League Dues Info" defaultOpen={false}>
				<LeagueDuesInfoCard />
			</Collapsible>
			<Collapsible title="Who Owes Who" defaultOpen={true}>
				<div className="payment-summary">
					<ul className="payment-grid">
						{players.map((player) => (
							<li key={player.name}>
								<OweSummaryCard player={player} />
							</li>
						))}
					</ul>
				</div>
			</Collapsible>
			<Collapsible title="Cost Breakdown" defaultOpen={false}>
				<ul>
					{costs.map((cost) => (
						<li key={cost.id}>
							<CostBreakdownCard cost={cost} />
						</li>
					))}
				</ul>
			</Collapsible>
		</div>
	);
};
