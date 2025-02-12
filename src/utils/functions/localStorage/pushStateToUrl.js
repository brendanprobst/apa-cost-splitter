export const pushStateToUrl = (
	teamName,
	teamNumber,
	dayOfWeek,
	gameVersion,
	players
) => {
	const newUrl = new URL(window.location);
	const playersNames = players.map((p) => p.name).join(",");
	newUrl.searchParams.set("teamName", teamName);
	newUrl.searchParams.set("teamNumber", teamNumber);
	newUrl.searchParams.set("dayOfWeek", dayOfWeek);
	newUrl.searchParams.set("gameVersion", gameVersion);
	newUrl.searchParams.set("players", playersNames);
	window.history.pushState({}, "", newUrl);
};
