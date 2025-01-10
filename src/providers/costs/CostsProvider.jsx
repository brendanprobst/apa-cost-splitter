import { useState } from "react";
import PropTypes from "prop-types";
import { CostsContext } from "./CostsContext";
import { initialCosts } from "../../utils/constants/costs/initialCosts";

export const CostsProvider = ({ children }) => {
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
	const value = {
		costs,
		setCosts,
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
