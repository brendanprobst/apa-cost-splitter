import PropTypes from "prop-types";
import { TeamContext } from "./TeamContext";
import { useLocalStorage } from "../../utils/functions/localStorage/useLocalStorage";
import { useEffect } from "react";

export const TeamProvider = ({ children }) => {
	const [team, setTeam, isTeamInitialized] = useLocalStorage("team", {});
	const [players, setPlayers, isPlayersInitialized] =
		useLocalStorage("players");
	const [playersNames] = useLocalStorage("players-names", []);
	useEffect(() => {
		console.log(players);
	}, [players]);
	const resetPlayerFormState = () => {
		console.warn("resetting player form state");
		const clearedPlayers = players?.map((player) => ({
			...player,
			playedMatch: false,
			attended: false,
			owes: [],
		}));
		setPlayers(clearedPlayers);
	};
	const isStorageInitialized = isPlayersInitialized && isTeamInitialized;
	const value = {
		team,
		setTeam,
		players,
		setPlayers,
		playersNames,
		resetPlayerFormState,
		isStorageInitialized,
	};
	return <TeamContext.Provider value={value}>{children}</TeamContext.Provider>;
};
TeamProvider.propTypes = {
	children: PropTypes.node.isRequired,
};
