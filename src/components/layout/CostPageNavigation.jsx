import { useCosts } from "../../providers/costs/useCosts";
import { useGlobal } from "../../providers/global/useGlobal";
import { useTeam } from "../../providers/team/useTeam";
import { getCurrentWeek } from "../../utils/functions/dates/getCurrentWeek";
import PropTypes from "prop-types";
export const CostPageNavigation = ({ variant }) => {
	const { formState, setFormState, setCurrentWeek } = useGlobal();
	const { players, resetPlayerFormState, team } = useTeam();
	const { costs, addRecipientsToCost, assignOwes, resetCostsFormState } =
		useCosts();
	const clearForm = () => {
		resetPlayerFormState();
		resetCostsFormState();
		setFormState(0);
	};

	const handleSavePage1 = (players) => {
		try {
			if (players.length === 0) {
				throw new Error(
					"No players added. Please add players before proceeding."
				);
			}

			const playersWhoPlayedMatch = players.filter(
				(player) => player.playedMatch
			);
			const playersWhoAttended = players.filter((player) => player.attended);

			if (playersWhoPlayedMatch.length === 0) {
				throw new Error(
					"No players marked as having played a match. Please check player attendance."
				);
			}
			if (playersWhoAttended.length === 0) {
				throw new Error(
					"No players marked as having attended. Please check player attendance."
				);
			}

			if (
				costs.some((cost) => cost.name === "League Dues" && !cost.paidBy) ||
				costs.some(
					(cost) =>
						cost.name === "Table Fees" &&
						(!cost.paidBy || !cost.cost || isNaN(parseFloat(cost.cost)))
				)
			) {
				throw new Error(
					"Please assign a payer to the League Dues and Table Fees before proceeding."
				);
			}
			//TODO: make both of these optional
			addRecipientsToCost(playersWhoPlayedMatch, "League Dues");
			addRecipientsToCost(playersWhoAttended, "Table Fees");
			return true;
		} catch (error) {
			alert(error.message);
			console.error("Error in handleNextState:", error);
			return false;
		}
	};
	const handleSavePage2 = (costs) => {
		try {
			if (costs.length === 0) {
				throw new Error("No costs added. Please add costs before proceeding.");
			}
			assignOwes();
			setCurrentWeek(getCurrentWeek(team.dayOfWeek));
			return true;
		} catch (error) {
			alert(error.message);
			console.error("Error in handleNextState:", error);
			return false;
		}
	};
	// document.addEventListener("scroll", () => {
	// 	const height = window.scrollY;
	// 	console.log("scroll height:", height);
	// });
	const handleScrollToTarget = () => {
		const formContainer = document.querySelector(".scroll-target");
		const headerHeight =
			document.querySelector("#cost-page-header")?.offsetHeight;
		console.log("headerHeight", headerHeight);
		const formContainerStartingPoint =
			formContainer?.getBoundingClientRect().top;
		console.log("formContainerStartingPoint", formContainerStartingPoint);
		if (formContainer && headerHeight && formContainerStartingPoint) {
			window.scrollTo({
				top: headerHeight,
				behavior: "smooth",
			});
		}
	};
	const handleNextState = () => {
		// Scroll to top of page
		let success = false;

		if (formState === 2) {
			clearForm();
			setFormState(0);
			return;
		}
		try {
			if (formState === 0) {
				success = handleSavePage1(players);
			} else if (formState === 1) {
				success = handleSavePage2(costs);
			}
			if (!success) {
				return;
			}
			setFormState(formState + 1);
			handleScrollToTarget();
		} catch (error) {
			alert(error.message);
			console.error("Error in handleNextState:", error);
		}
	};
	const handlePrevState = () => {
		handleScrollToTarget();
		setFormState(formState - 1);
	};
	return (
		<div className="sub-header" id="navigation">
			<div className="flex w-full justify-between gap-4">
				{variant === "sub-header" ? (
					<>
						<button
							disabled={formState === 0}
							onClick={() => handlePrevState()}
							className="previous-button">
							Previous
						</button>
						<button
							className="clear-form-button error-btn-outlined"
							onClick={() => clearForm()}>
							Start Over
						</button>
					</>
				) : (
					<></>
				)}
				<button
					disabled={formState === 2}
					onClick={() => handleNextState()}
					className={`next-button ${variant === "footer" ? "w-full" : ""}`}>
					Next
				</button>
			</div>
		</div>
	);
};
CostPageNavigation.propTypes = {
	variant: PropTypes.string,
};
