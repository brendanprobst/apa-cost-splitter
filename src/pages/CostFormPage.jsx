import { useEffect } from "react";
import { CostPageHeader } from "../components/layout/CostPageHeader";
import { useTeam } from "../providers/team/useTeam";
import { emptyPlayer } from "../utils/constants/players/emptyPlayer";
import { updatePersistentTeamData } from "../utils/functions/localStorage/updatePersistentTeamData";
import { CurrentState } from "../components/dev/CurrentState";
import { useCosts } from "../providers/costs/useCosts";
import { initialCosts } from "../utils/constants/costs/initialCosts";
import { useGlobal } from "../providers/global/useGlobal";
import { AppFooter } from "../components/layout/AppFooter";
import { PlayerAttendanceView } from "../components/views/CostFormViews/PlayerAttendanceView";
import { AssignCostsView } from "../components/views/CostFormViews/AssignCostsView";
import { CostSplitSummaryView } from "../components/views/CostFormViews/CostSplitSummaryView";

export const CostFormPage = () => {
	const {
		teamName,
		setTeamName,
		setTeamNumber,
		players,
		setPlayers,
		setPlayersNames,
	} = useTeam();
	const { costs } = useCosts();
	const { formState } = useGlobal();

	// on page reload - handle loading state from localstorage
	useEffect(() => {
		const loadPersistentTeamData = () => {
			// if (hasLoadedFormData.current) {
			const handleLoadingPlayers = (playersNames) => {
				setPlayers((prev) => {
					return playersNames.map((name) => {
						const player = prev.find((player) => player.name === name);
						return player || { ...emptyPlayer, name };
					});
				});
			};

			// First check URL parameters
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
				// console.log("Found team data in URL", {
				// 	team: teamNameFromUrl,
				// 	players: playersNamesFromUrl,
				// 	teamNumber: teamNumberFromUrl,
				// });
				updatePersistentTeamData(
					playersNamesFromUrl,
					teamNameFromUrl,
					teamNumberFromUrl
				);
				setTeamName(teamNameFromUrl);
				setTeamNumber(teamNumberFromUrl);

				setPlayersNames(playersNamesFromUrl);
				handleLoadingPlayers(playersNamesFromUrl);
				return;
			}

			// If no URL data, check localStorage
			const localStorageData = localStorage.getItem("persistentTeamState");
			if (localStorageData) {
				try {
					const teamData = JSON.parse(localStorageData);
					// console.log("Found team data in local storage", teamData);
					const playersNames = teamData?.players;
					// console.log(playersNames);
					if (!playersNames || playersNames.length === 0) {
						console.warn("No valid players found in local storage");
					}
					setTeamName(teamData.team);
					setTeamNumber(teamData.teamNumber);
					setPlayersNames(playersNames);
					handleLoadingPlayers(playersNames);
				} catch (e) {
					console.error("Failed to load team data from local storage", e);
				}
			} else {
				console.warn("No team data found in URL or local storage");
			}
		};

		loadPersistentTeamData();

		console.log("finished loading");
	}, []);

	useEffect(() => {
		const updatePersistentFormData = (players, costs, formState) => {
			try {
				let state = { players, costs, formState };
				let initialState = {
					players: [],
					costs: initialCosts,
					formState: 0,
				};
				if (JSON.stringify(state) !== JSON.stringify(initialState)) {
					// console.log("Saving form data to local storage: ", state);
					localStorage.setItem("persistentFormState", JSON.stringify(state));
				} else {
					// console.log("They're the same do nothing");
				}
			} catch (error) {
				console.error("Failed to update persistent form state:", error);
			}
		};
		// console.log("EXECUTE updatePersistentFormData");
		updatePersistentFormData(players, costs, formState);
	}, [players, costs, formState]);
	// const clearForm = () => {
	// 	setFormState(0);
	// 	localStorage.removeItem("persistentFormState");
	// };

	return (
		<div className="app-container">
			<CostPageHeader
				teamName={teamName}
				teamNumber={teamName}
				players={players}
			/>

			<div className="page">
				{formState === 0 ? <PlayerAttendanceView /> : <></>}
				{formState === 1 ? <AssignCostsView /> : <></>}
				{formState === 2 ? <CostSplitSummaryView /> : <></>}
			</div>
			<AppFooter />
			<CurrentState />
		</div>
	);
};
