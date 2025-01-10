import { useState } from "react";
import PropTypes from "prop-types";
import { CostsContext } from "./CostsContext";
import { initialCosts } from "../../utils/constants/costs/initialCosts";

export const CostsProvider = ({ children }) => {
	const [costs, setCosts] = useState(initialCosts);
	const resetCostsFormState = () => {
		setCosts(initialCosts);
	};
	const value = { costs, setCosts, resetCostsFormState };
	return (
		<CostsContext.Provider value={value}>{children}</CostsContext.Provider>
	);
};
CostsProvider.propTypes = {
	children: PropTypes.node.isRequired,
};
