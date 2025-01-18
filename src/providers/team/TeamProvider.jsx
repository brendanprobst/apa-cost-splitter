import PropTypes from "prop-types";
import { TeamContext } from "./TeamContext";
import { useLocalStorage } from "../../utils/functions/localStorage/useLocalStorage";

export const TeamProvider = ({ children }) => {
	const [team, setTeam] = useLocalStorage("team", {});
	const [players, setPlayers] = useLocalStorage("players", []);
	const [playersNames] = useLocalStorage("players-names", []);

	const resetPlayerFormState = () => {
		const clearedPlayers = players?.map((player) => ({
			...player,
			playedMatch: false,
			attended: false,
			owes: [],
		}));
		setPlayers(clearedPlayers);
	};

	const value = {
		team,
		setTeam,
		players,
		setPlayers,
		playersNames,
		resetPlayerFormState,
	};
	return <TeamContext.Provider value={value}>{children}</TeamContext.Provider>;
};
TeamProvider.propTypes = {
	children: PropTypes.node.isRequired,
};
