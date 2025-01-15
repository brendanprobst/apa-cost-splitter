import { useEffect } from "react";

import { useTeam } from "../providers/team/useTeam";
import { useGlobal } from "../providers/global/useGlobal";
import { CostPageHeader } from "../components/layout/CostPageHeader";
import { AppFooter } from "../components/layout/AppFooter";
import { PlayerAttendanceView } from "../components/views/PlayerAttendanceView";
import { AdditionalCostsView } from "../components/views/AdditionalCostsView";
import { CostSplitSummaryView } from "../components/views/CostSplitSummaryView";
import { CostPageNavigation } from "../components/layout/CostPageNavigation";

import { updatePersistentTeamData } from "../utils/functions/localStorage/updatePersistentTeamData";
import { CurrentState } from "../components/dev/CurrentState";
export const CostFormPage = () => {
	const { team, setTeam, setPlayersNames } = useTeam();
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
				updatePersistentTeamData(
					playersNamesFromUrl,
					teamNameFromUrl,
					teamNumberFromUrl
				);
				setTeam({
					name: teamNameFromUrl,
					number: teamNumberFromUrl,
				});
				setPlayersNames(playersNamesFromUrl);
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

			<div className="page">
				{formState === 0 ? <PlayerAttendanceView /> : <></>}
				{formState === 1 ? <AdditionalCostsView /> : <></>}
				{formState === 2 ? <CostSplitSummaryView /> : <></>}
				<CostPageNavigation />
			</div>
			<AppFooter />
			<CurrentState />
		</div>
	);
};
