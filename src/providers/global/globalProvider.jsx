import { useState } from "react";
import PropTypes from "prop-types";
import { GlobalContext } from "./GlobalContext";
import { useLocalStorage } from "../../utils/functions/localStorage/useLocalStorage";
import { use } from "react";

export const GlobalProvider = ({ children }) => {
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
	return (
		<GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
	);
};
GlobalProvider.propTypes = {
	children: PropTypes.node.isRequired,
};
