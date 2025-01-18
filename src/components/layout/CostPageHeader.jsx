import { useState } from "react";
import { ManageTeamModal } from "../modals/ManageTeamModal";
import { useTeam } from "../../providers/team/useTeam";

export const CostPageHeader = () => {
	const { team, players } = useTeam();
	const [isManageTeamModalOpen, setIsManageTeamModalOpen] = useState(false);
	const [optionsVisible, setOptionsVisible] = useState(false);
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
	return (
		<>
			<header className="app-header" id="cost-page-header">
				<div className="flex justify-between items-end">
					<div>
						<h1 className="app-header-title">APA Cost Splitter</h1>
						<h2 className="team-name">
							Team {team.name ? team.name : "Not Found"}{" "}
							<span className="team-number">{team.number}</span>
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
