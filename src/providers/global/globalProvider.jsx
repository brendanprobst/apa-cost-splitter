import { useState } from "react";
import PropTypes from "prop-types";
import { GlobalContext } from "./GlobalContext";

export const GlobalProvider = ({ children }) => {
	const [formState, setFormState] = useState(0);
	const [settings, setSettings] = useState({
		useHubMethod: true,
	});
	const value = { formState, setFormState, settings, setSettings };
	return (
		<GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
	);
};
GlobalProvider.propTypes = {
	children: PropTypes.node.isRequired,
};
