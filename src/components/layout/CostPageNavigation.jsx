import { useCosts } from "../../providers/costs/useCosts";
import { useGlobal } from "../../providers/global/useGlobal";
import { useTeam } from "../../providers/team/useTeam";

export const CostPageNavigation = () => {
	const { formState, setFormState, getCurrentWeek, setCurrentWeek } =
		useGlobal();
	const { players, resetPlayerFormState } = useTeam();
	const { costs, addRecipientsToCost, assignOwes, resetCostsFormState } =
		useCosts();
	const clearForm = () => {
		resetPlayerFormState();
		resetCostsFormState();
		setFormState(0);
	};
	const handlePrevState = () => {
		const formContainer = document.querySelector(".page");
		if (formContainer) {
			formContainer.scrollIntoView({ behavior: "smooth" });
		}
		setFormState(formState - 1);
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
					(cost) => cost.name === "Table Fees" && !cost.paidBy && !cost.cost
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
			setCurrentWeek(getCurrentWeek());
			return true;
		} catch (error) {
			alert(error.message);
			console.error("Error in handleNextState:", error);
			return false;
		}
	};
	const handleNextState = () => {
		// Scroll to top of page
		let success = false;
		const formContainer = document.querySelector(".page");
		if (formContainer) {
			formContainer.scrollIntoView({ behavior: "smooth" });
		}
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
		} catch (error) {
			alert(error.message);
			console.error("Error in handleNextState:", error);
		}
	};

	return (
		<div className="flex gap-2">
			{formState !== 0 && (
				<button onClick={() => handlePrevState()} className="previous-button">
					Previous
				</button>
			)}
			<button
				onClick={handleNextState}
				className={`next-button ${formState === 2 ? "error-btn" : ""}`}>
				{formState < 2 ? "Next" : "Reset Form"}
			</button>
		</div>
	);
};
