import { useEffect } from "react";

import { useTeam } from "../providers/team/useTeam";
import { useGlobal } from "../providers/global/useGlobal";
import { CostPageHeader } from "../components/layout/CostPageHeader";
import { AppFooter } from "../components/layout/AppFooter";
import { PlayerAttendanceView } from "../components/views/PlayerAttendanceView";
import { AdditionalCostsView } from "../components/views/AdditionalCostsView";
import { CostSplitSummaryView } from "../components/views/CostSplitSummaryView";
import { CostPageNavigation } from "../components/layout/CostPageNavigation";

// import { updatePersistentTeamData } from "../utils/functions/localStorage/updatePersistentTeamData";
import { CurrentState } from "../components/dev/CurrentState";
import { emptyPlayer } from "../utils/constants/players/emptyPlayer";
export const CostFormPage = () => {
	const { team, setTeam, setPlayers } = useTeam();
	const { formState } = useGlobal();

	useEffect(() => {
		const loadPersistentTeamData = () => {
			const urlParams = new URLSearchParams(window.location.search);
			const teamNameFromUrl = urlParams.get("teamName");
			const teamNumberFromUrl = urlParams.get("teamNumber");
			const playersNamesFromUrl = urlParams.get("players")
				? urlParams.get("players").split(",")
				: [];

			if (
				teamNameFromUrl &&
				teamNumberFromUrl &&
				playersNamesFromUrl.length > 0
			) {
				// updatePersistentTeamData(
				// 	playersNamesFromUrl,
				// 	teamNameFromUrl,
				// 	teamNumberFromUrl
				// );
				setTeam({
					name: teamNameFromUrl,
					number: teamNumberFromUrl,
				});
				const newPlayers = playersNamesFromUrl?.map((name) => {
					return { ...emptyPlayer, name };
				});
				setPlayers(newPlayers);
				return;
			} else {
				console.warn("No team data found in URL");
			}
		};

		loadPersistentTeamData();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

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
			<AppFooter />
			<CurrentState />
		</div>
	);
};
