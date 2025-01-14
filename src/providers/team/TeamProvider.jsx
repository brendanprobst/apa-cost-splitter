import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { TeamContext } from "./TeamContext";
import { emptyPlayer } from "../../utils/constants/players/emptyPlayer";

export const TeamProvider = ({ children }) => {
	const [team, setTeam] = useState({});
	const [players, setPlayers] = useState([]);
	const [playersNames, setPlayersNames] = useState([]);

	useEffect(() => {
		const newPlayers = playersNames.map((name) => {
			return { ...emptyPlayer, name };
		});
		setPlayers(newPlayers);
	}, [playersNames]);

	const resetPlayerFormState = () => {
		const clearedPlayers = players.map((player) => ({
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
		setPlayersNames,
		resetPlayerFormState,
	};
	return <TeamContext.Provider value={value}>{children}</TeamContext.Provider>;
};
TeamProvider.propTypes = {
	children: PropTypes.node.isRequired,
};
