import { useState } from "react";
import PropTypes from "prop-types";
import { GlobalContext } from "./globalContext";

export const GlobalProvider = ({ children }) => {
	const [formState, setFormState] = useState(0);
	const value = { formState, setFormState };
	return (
		<GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
	);
};
GlobalProvider.propTypes = {
	children: PropTypes.node.isRequired,
};
