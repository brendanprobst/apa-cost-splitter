export const handleGenerateZelleMessage = (team, currentWeek) => {
	return `Team Number - ${
		team?.number ? team.number : "Team Number"
	}\nTeam Name - ${team?.name ? team.name : "Team Name"}\nWeek # - ${
		currentWeek ? currentWeek : "Week Number"
	}`;
};

export const handleCopyZelleMessage = (team, currentWeek) => {
	let message = handleGenerateZelleMessage(team, currentWeek);
	navigator.clipboard.writeText(message).then(
		() => {
			alert("Zelle message copied to clipboard!");
		},
		(err) => {
			console.error("Could not copy text: ", err);
			alert("Failed to copy to clipboard. Please try again.");
		}
	);
};
