import { useEffect } from "react";

import { useTeam } from "../providers/team/useTeam";
import { useApp } from "../providers/app/useApp";
import { CostPageHeader } from "../components/layout/CostPageHeader";
import { PlayerAttendanceView } from "../components/views/PlayerAttendanceView";
import { AdditionalCostsView } from "../components/views/AdditionalCostsView";
import { CostSplitSummaryView } from "../components/views/CostSplitSummaryView";
import { CostPageNavigation } from "../components/layout/CostPageNavigation";

// import { updatePersistentTeamData } from "../utils/functions/localStorage/updatePersistentTeamData";
// import { CurrentState } from "../components/dev/CurrentState";
import { emptyPlayer } from "../utils/constants/players/emptyPlayer";
export const CostFormPage = () => {
	const { team, setTeam, setPlayers, isStorageInitialized } = useTeam();
	const { formState } = useApp();

	useEffect(() => {
		// Only run after localStorage is initialized
		if (!isStorageInitialized) {
			return;
		}

		const loadPersistentTeamData = () => {
			const urlParams = new URLSearchParams(window.location.search);
			const teamNameFromUrl = urlParams.get("teamName");
			const teamNumberFromUrl = urlParams.get("teamNumber");
			const dayOfWeekFromUrl = urlParams.get("dayOfWeek");
			const gameVersionFromUrl = urlParams.get("gameVersion");
			const playersNamesFromUrl = urlParams.get("players")
				? urlParams.get("players").split(",")
				: [];

			if (
				teamNameFromUrl &&
				teamNumberFromUrl &&
				dayOfWeekFromUrl &&
				gameVersionFromUrl
			) {
				setTeam({
					name: teamNameFromUrl,
					number: teamNumberFromUrl,
					dayOfWeek: dayOfWeekFromUrl,
					gameVersion: gameVersionFromUrl,
				});

				if (playersNamesFromUrl.length > 0) {
					// Convert current players to name-only array for comparison
					const currentPlayerNames =
						team.players?.map((player) => player.name) || [];

					// Check if the arrays are different
					const hasNewPlayers =
						playersNamesFromUrl.some(
							(name) => !currentPlayerNames.includes(name)
						) ||
						currentPlayerNames.some(
							(name) => !playersNamesFromUrl.includes(name)
						);

					// Only update players if there are differences
					if (hasNewPlayers) {
						const newPlayers = playersNamesFromUrl.map((name) => {
							return { ...emptyPlayer, name };
						});
						setPlayers(newPlayers);
					}
				}
				return;
			} else {
				console.warn("Incomplete team data found in URL");
			}
		};

		loadPersistentTeamData();
	}, [isStorageInitialized]);

	return (
		<div className="app-container">
			<CostPageHeader team={team} />
			<CostPageNavigation variant={"sub-header"} />

			<div className="page scroll-target">
				{formState === 0 ? <PlayerAttendanceView /> : <></>}
				{formState === 1 ? <AdditionalCostsView /> : <></>}
				{formState === 2 ? <CostSplitSummaryView /> : <></>}
			</div>
			<CostPageNavigation variant={"footer"} />
			{/* <CurrentState /> */}
		</div>
	);
};
