import { useMemo, useState } from "react";
import PropTypes from "prop-types";
import { TeamContext } from "./TeamContext";
import { emptyPlayer } from "../../utils/constants/players/emptyPlayer";

export const TeamProvider = ({ children }) => {
	const [playersNames, setPlayersNames] = useState([]);

	const _initialPlayers = useMemo(
		() =>
			playersNames.map((name) => ({
				...emptyPlayer,
				name,
			})),
		[playersNames]
	);
	const urlParams = new URLSearchParams();
	const _teamName = urlParams.get("teamName");
	const _teamNumber = urlParams.get("teamNumber");

	const [teamName, setTeamName] = useState(_teamName);
	const [teamNumber, setTeamNumber] = useState(_teamNumber);
	const [players, setPlayers] = useState(_initialPlayers);

	const value = {
		teamName,
		teamNumber,
		setTeamName,
		setTeamNumber,
		players,
		setPlayers,
		playersNames,
		setPlayersNames,
	};
	return <TeamContext.Provider value={value}>{children}</TeamContext.Provider>;
};
TeamProvider.propTypes = {
	children: PropTypes.node.isRequired,
};
