import { useState } from "react";
import { ManageTeamModal } from "../modals/ManageTeamModal";
import PropTypes from "prop-types";
import { useTeam } from "../../providers/team/useTeam";
import { useCosts } from "../../providers/costs/useCosts";
import { useGlobal } from "../../providers/global/useGlobal";

export const CostPageHeader = ({ players }) => {
	const { teamName, teamNumber, resetPlayerFormState } = useTeam();
	const { resetCostsFormState } = useCosts();
	const { setFormState } = useGlobal();
	const [isManageTeamModalOpen, setIsManageTeamModalOpen] = useState(false);
	const clearForm = () => {
		resetPlayerFormState();
		resetCostsFormState();
		setFormState(0);
	};
	const handleCopyShareLink = () => {
		const newUrl = new URL(window.location);
		newUrl.searchParams.set("team", teamName);
		newUrl.searchParams.set("teamNumber", teamNumber);
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
			<header className="app-header">
				<h4 className="app-title">APA Cost Splitter</h4>
				<div className="flex flex-wrap gap-4 justify-between items-end">
					<div>
						{teamName && <h2 className="team-name">Team {teamName}</h2>}
						{teamNumber && <h3 className="team-number">{teamNumber}</h3>}
						<div className="flex gap-2">
							<button
								onClick={() =>
									setIsManageTeamModalOpen(!isManageTeamModalOpen)
								}>
								Manage Team
							</button>
						</div>
					</div>
					<button onClick={() => handleCopyShareLink()} id="share-team-button">
						Share Link With Team
					</button>
				</div>
				<ManageTeamModal
					isOpen={isManageTeamModalOpen}
					setIsOpen={setIsManageTeamModalOpen}
				/>
			</header>
			<div className="sub-header">
				<button
					className="clear-form-button error-btn"
					onClick={() => clearForm()}>
					Start Over
				</button>
			</div>
		</>
	);
};
CostPageHeader.propTypes = {
	players: PropTypes.arrayOf(
		PropTypes.shape({
			name: PropTypes.string,
		})
	),
};
