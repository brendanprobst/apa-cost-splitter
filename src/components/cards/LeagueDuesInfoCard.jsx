import { useApp } from "../../providers/app/useApp";
import { useTeam } from "../../providers/team/useTeam";
import {
	handleCopyZelleMessage,
	handleGenerateZelleMessage,
} from "../../utils/functions/leagueDues/zelleSubject";

export const LeagueDuesInfoCard = () => {
	const { team } = useTeam();
	const { currentWeek } = useApp();

	const leagueZelleEmail = "brooklynqueenspayment@gmail.com";

	const handleCopyZelleEmail = () => {
		navigator.clipboard.writeText(leagueZelleEmail).then(
			() => {
				alert("Zelle email copied to clipboard!");
			},
			(err) => {
				console.error("Could not copy text: ", err);
				alert("Failed to copy to clipboard. Please try again.");
			}
		);
	};

	return (
		<div className="zelle-info-box">
			<p className="zelle-instructions">
				Please Zelle <span className="zelle-amount">$60</span> to{" "}
				<span className="zelle-email">{leagueZelleEmail}</span>
			</p>
			<p className="zelle-subject-instructions">
				In the subject include:
				<span className="zelle-subject">
					{handleGenerateZelleMessage(team, currentWeek)}
				</span>
			</p>
			<div className="zelle-buttons">
				<button
					className="zelle-copy-btn"
					onClick={() => {
						handleCopyZelleEmail();
					}}>
					Copy Zelle Email
				</button>
				<button
					className="zelle-copy-btn"
					onClick={() => handleCopyZelleMessage(team, currentWeek)}>
					Copy Zelle Subject
				</button>
			</div>
			<p>Please always confirm the week is correct</p>
		</div>
	);
};
