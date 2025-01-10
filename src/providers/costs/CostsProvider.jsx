import { useState } from "react";
import PropTypes from "prop-types";
import { CostsContext } from "./CostsContext";
import { initialCosts } from "../../utils/constants/costs/initialCosts";

export const TeamProvider = ({ children }) => {
	const [costs, setCosts] = useState(initialCosts);
	const value = { costs, setCosts };
	return (
		<CostsContext.Provider value={value}>{children}</CostsContext.Provider>
	);
};
TeamProvider.propTypes = {
	children: PropTypes.node.isRequired,
};
