import { useState } from "react";
import { ManageTeamModal } from "../modals/ManageTeamModal";
import { useTeam } from "../../providers/team/useTeam";
import { useNavigate } from "react-router";
import { useCosts } from "../../providers/costs/useCosts";
import { initialCosts } from "../../utils/constants/costs/initialCosts";

export const CostPageHeader = () => {
	const navigate = useNavigate();
	const { team, players, resetPlayerFormState } = useTeam();
	const { costs, resetCostsFormState } = useCosts();
	const [isManageTeamModalOpen, setIsManageTeamModalOpen] = useState(false);
	const [optionsVisible, setOptionsVisible] = useState(false);
	const [isConfirmingGoHome, setIsConfirmingGoHome] = useState(false);
	const handleCopyShareLink = () => {
		const newUrl = new URL(window.location);
		newUrl.searchParams.set("team", team.name);
		newUrl.searchParams.set("teamNumber", team.number);
		newUrl.searchParams.set("players", players.map((p) => p.name).join(","));
		navigator.clipboard.writeText(newUrl.toString()).then(
			() => {
				alert("Link copied to clipboard!");
			},
			(err) => {
				console.error("Could not copy text: ", err);
				alert("Failed to copy to clipboard. Please try again.");
			}
		);
	};

	const shouldShowSaveWarning = () => {
		//players who have attendance or match played set to true
		const playersWhoPlayedMatch = players.filter(
			(player) => player.playedMatch
		);
		const playersWhoAttended = players.filter((player) => player.attended);
		const playersUpdated =
			playersWhoAttended.length !== 0 || playersWhoPlayedMatch.length !== 0;
		//costs are not the initial costs
		const costsUpdated = JSON.stringify(costs) !== JSON.stringify(initialCosts);
		return playersUpdated || costsUpdated;
	};
	const handleShouldShowSaveWarning = () => {
		if (shouldShowSaveWarning()) {
			setIsConfirmingGoHome(true);
		} else {
			navigate("/");
		}
	};

	const handleGoHome = () => {
		resetCostsFormState();
		resetPlayerFormState();

		setIsConfirmingGoHome(false);
		navigate("/");
	};
	return (
		<>
			<header className="app-header" id="cost-page-header">
				<div className="flex justify-between items-end">
					<div>
						<button
							onClick={() => handleShouldShowSaveWarning()}
							className="unstyled app-header-title">
							<svg
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
								className="mr-2">
								<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
								<polyline points="9 22 9 12 15 12 15 22"></polyline>
							</svg>
							APA Cost Splitter
						</button>
						<h2 className="team-name">
							Team {team?.name ? team.name : "Not Found"}{" "}
							<span className="team-number">{team?.number}</span>
						</h2>
					</div>
					<button
						onClick={() => setOptionsVisible(!optionsVisible)}
						style={{
							background: "none",
							border: "none",
							padding: "8px",
							cursor: "pointer",
							color: "#ecf0f1",
							backgroundColor: "#2c3e50",
							aspectRatio: "1",
							width: "50px",
							height: "50px",
						}}>
						<svg
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round">
							<path
								d={
									optionsVisible
										? "M18 15l-6-6-6 6" // Points up when open
										: "M6 9l6 6 6-6" // Points down when closed
								}
							/>
						</svg>
					</button>
				</div>
				{optionsVisible ? (
					<div className="flex flex-wrap gap-4 justify-between items-start mt-5">
						<div className="flex flex-col justify-end">
							<button
								className="fancy-btn"
								onClick={() =>
									setIsManageTeamModalOpen(!isManageTeamModalOpen)
								}>
								Manage Team
							</button>
						</div>
						<div className="flex flex-col justify-end">
							<button
								onClick={() => handleCopyShareLink()}
								id="share-team-button">
								Copy Share Link
							</button>
							<p className="subtle-text">Quick set up for your teammates</p>
						</div>
					</div>
				) : (
					<></>
				)}
				{isConfirmingGoHome ? (
					<div className="modal-overlay">
						<div className="modal-content">
							<h2>Go Home?</h2>
							<p>
								You <b>may</b> have unsaved changes.
								<br /> If you go home, you will lose information about
								tonight&apos;s attendance and costs, but your team&apos;s
								information won&apos;t be affected.
							</p>
							<div className="flex justify-between">
								<button
									onClick={() => {
										handleGoHome();
									}}>
									Go Home
								</button>
								<button
									onClick={() => {
										setIsConfirmingGoHome(false);
									}}
									className="outlined-btn">
									Stay Here
								</button>
							</div>
						</div>
					</div>
				) : (
					<></>
				)}
				<div className="fixed inset-0 overflow-y-auto" style={{ zIndex: 50 }}>
					<ManageTeamModal
						isOpen={isManageTeamModalOpen}
						setIsOpen={setIsManageTeamModalOpen}
					/>
				</div>
			</header>
		</>
	);
};
