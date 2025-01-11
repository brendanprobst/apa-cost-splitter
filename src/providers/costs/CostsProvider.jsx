import { useState } from "react";
import PropTypes from "prop-types";
import { CostsContext } from "./CostsContext";
import { initialCosts } from "../../utils/constants/costs/initialCosts";
import { useTeam } from "../team/useTeam";
import { useGlobal } from "../global/useGlobal";

export const CostsProvider = ({ children }) => {
	const { settings } = useGlobal();
	const { players, setPlayers } = useTeam();
	const [costs, setCosts] = useState(initialCosts);
	const assignPayerToCost = (playerName, costName) => {
		setCosts((prev) =>
			prev.map((cost) =>
				cost.name === costName ? { ...cost, paidBy: playerName } : cost
			)
		);
	};
	const assignAmountToCost = (costName, costAmount) => {
		setCosts((prev) =>
			prev.map((cost) =>
				cost.name === costName ? { ...cost, cost: costAmount } : cost
			)
		);
	};
	const addRecipientsToCost = (players, costName) => {
		const playerNames = players.map((player) => player.name);

		setCosts((prev) =>
			prev.map((cost) =>
				cost.name === costName
					? {
							...cost,
							sharedBy: [...new Set([...cost.sharedBy, ...playerNames])],
							splitAmount:
								cost.cost / new Set([...cost.sharedBy, ...playerNames]).size,
					  }
					: cost
			)
		);
	};
	const resetCostsFormState = () => {
		setCosts(initialCosts);
	};
	const addOwesToPlayers = (personWhoOwes, costAmount, personWhoIsOwed) => {
		setPlayers((prev) =>
			prev.map((player) =>
				player.name === personWhoOwes
					? {
							...player,
							owes: player.owes.some((owe) => owe.payee === personWhoIsOwed)
								? player.owes.map((owe) =>
										owe.payee === personWhoIsOwed
											? { ...owe, amount: owe.amount + costAmount }
											: owe
								  )
								: [
										...player.owes,
										{
											amount: costAmount,
											owedTo: personWhoIsOwed,
										},
								  ],
					  }
					: player
			)
		);
	};
	const assignOwes = () => {
		// Clear existing owes first
		setPlayers((prev) => prev.map((player) => ({ ...player, owes: [] })));

		if (!settings.useHubMethod) {
			console.log("using the simple method");
			// Assign owes directly
			console.log("about to assign owes - costs: ", costs);
			costs.forEach((cost) => {
				cost.sharedBy.forEach((person) => {
					addOwesToPlayers(
						person,
						cost.cost / cost.sharedBy.length,
						cost.paidBy
					);
				});
			});
			console.log("finished assign owes - costs: ", players);

			return;
		}
		console.log("using hub method");
		// Calculate total amount paid by each person
		const totalPaid = {};
		costs.forEach((cost) => {
			totalPaid[cost.paidBy] = (totalPaid[cost.paidBy] || 0) + cost.cost;
		});
		console.log({ costs });
		console.log({ totalPaid });
		// Add totalPaid to each player
		setPlayers((prev) =>
			prev.map((player) => ({
				...player,
				totalPaid: totalPaid[player.name] || 0,
			}))
		);

		// Calculate what each person should have paid based on their shares
		const shouldHavePaid = {};
		costs.forEach((cost) => {
			const perPersonShare = cost.cost / cost.sharedBy.length;
			cost.sharedBy.forEach((person) => {
				shouldHavePaid[person] = (shouldHavePaid[person] || 0) + perPersonShare;
			});
		});
		console.log({ shouldHavePaid });
		// Add shouldHavePaid to each player
		setPlayers((prev) =>
			prev.map((player) => ({
				...player,
				totalShouldHavePaid: shouldHavePaid[player.name] || 0,
			}))
		);
		// add totalPaid to players

		// Calculate initial net balances
		const netBalances = {};
		Object.keys(shouldHavePaid).forEach((person) => {
			console.log({ person });
			console.log(
				"expected net balance",
				(totalPaid[person] || 0) - shouldHavePaid[person]
			);
			netBalances[person] = (totalPaid[person] || 0) - shouldHavePaid[person];
		});
		console.log({ netBalances });
		// Settle mutual debts first
		const people = Object.keys(netBalances);
		for (let i = 0; i < people.length; i++) {
			for (let j = i + 1; j < people.length; j++) {
				const person1 = people[i];
				const person2 = people[j];

				// If they owe in opposite directions
				if (netBalances[person1] > 0 && netBalances[person2] < 0) {
					const settlement = Math.min(
						netBalances[person1],
						-netBalances[person2]
					);
					netBalances[person1] -= settlement;
					netBalances[person2] += settlement;
					if (settlement > 0) {
						addOwesToPlayers(person2, settlement, person1);
					}
				} else if (netBalances[person1] < 0 && netBalances[person2] > 0) {
					const settlement = Math.min(
						-netBalances[person1],
						netBalances[person2]
					);
					netBalances[person1] += settlement;
					netBalances[person2] -= settlement;
					if (settlement > 0) {
						addOwesToPlayers(person1, settlement, person2);
					}
				}
			}
		}

		// Find the person who is still owed the most (the hub) for remaining debts
		const hub = Object.entries(netBalances).reduce(
			(max, [person, balance]) =>
				balance > (max?.balance || -Infinity) ? { person, balance } : max,
			null
		)?.person;

		if (!hub) return;

		// Calculate and assign remaining debts through the hub
		Object.entries(netBalances).forEach(([person, balance]) => {
			if (person !== hub && balance < 0) {
				const amountOwed = Math.abs(balance);
				if (amountOwed > 0) {
					addOwesToPlayers(person, amountOwed, hub);
				}
			}
		});
	};
	const value = {
		costs,
		setCosts,
		assignOwes,
		resetCostsFormState,
		assignPayerToCost,
		assignAmountToCost,
		addRecipientsToCost,
	};
	return (
		<CostsContext.Provider value={value}>{children}</CostsContext.Provider>
	);
};
CostsProvider.propTypes = {
	children: PropTypes.node.isRequired,
};
