import { useState } from "react";
import PropTypes from "prop-types";
import { GlobalContext } from "./GlobalContext";

export const GlobalProvider = ({ children }) => {
	const [formState, setFormState] = useState(0);
	const [settings, setSettings] = useState({
		useHubMethod: true,
	});
	const [currentWeek, setCurrentWeek] = useState("");

	const value = {
		formState,
		setFormState,
		settings,
		setSettings,
		currentWeek,
		setCurrentWeek,
	};
	return (
		<GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
	);
};
GlobalProvider.propTypes = {
	children: PropTypes.node.isRequired,
};
