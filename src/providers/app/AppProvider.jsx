import { useState } from "react";
import PropTypes from "prop-types";
import { AppContext } from "./AppContext";
import { useLocalStorage } from "../../utils/functions/localStorage/useLocalStorage";

export const AppProvider = ({ children }) => {
	const [formState, setFormState] = useLocalStorage("formState", 0);
	const [allTeams, setAllTeams] = useLocalStorage("allTeams", []);

	const [currentWeek, setCurrentWeek] = useState("");

	const value = {
		formState,
		setFormState,
		allTeams,
		setAllTeams,
		currentWeek,
		setCurrentWeek,
	};
	return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
AppProvider.propTypes = {
	children: PropTypes.node.isRequired,
};
