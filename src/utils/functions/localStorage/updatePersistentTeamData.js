export const updatePersistentTeamData = (players, team, teamNumber) => {
	// console.log("updating persistent data");
	localStorage.setItem(
		"persistentTeamState",
		JSON.stringify({ players, team, teamNumber })
	);
};
