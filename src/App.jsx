import { useState, useEffect, useRef, useMemo } from "react";

function App() {
	const leagueZelleEmail = "brooklynqueenspayment@gmail.com";
	const weeks = {
		1: new Date("2024-09-26T18:00:00-04:00"),
		2: new Date("2024-10-03T18:00:00-04:00"),
		3: new Date("2024-10-10T18:00:00-04:00"),
		4: new Date("2024-10-17T18:00:00-04:00"),
		5: new Date("2024-10-24T18:00:00-04:00"),
		6: new Date("2024-10-31T18:00:00-04:00"),
		7: new Date("2024-11-07T18:00:00-04:00"),
		8: new Date("2024-11-14T18:00:00-04:00"),
		9: new Date("2024-11-21T18:00:00-04:00"),
		10: new Date("2024-12-05T18:00:00-04:00"),
		11: new Date("2024-12-12T18:00:00-04:00"),
		12: new Date("2024-12-19T18:00:00-04:00"),
		13: new Date("2024-12-26T18:00:00-04:00"),
		14: new Date("2025-01-02T18:00:00-04:00"),
		15: new Date("2025-01-09T18:00:00-04:00"),
	};
	const getCurrentWeek = () => {
		const now = new Date();
		// Add a day to account for matches that end after midnight
		now.setDate(now.getDate() + 1);

		// Find the closest past week
		let closestWeek = null;
		let smallestDiff = Infinity;

		for (const [weekNum, weekDate] of Object.entries(weeks)) {
			// console.log("checking week", weekNum, weekDate);
			const diff = Math.abs(weekDate - now);
			if (weekDate <= now && diff < smallestDiff) {
				// console.log("found a week that is less than now", weekNum, weekDate);
				smallestDiff = diff;
				closestWeek = weekNum;
			}
		}

		return closestWeek || "1"; // Default to week 1 if no past week found
	};
	// const hasLoadedFormData = useRef(false);
	// const hasLoadedTeamData = useRef(false);
	const urlParams = new URLSearchParams(window.location.search);
	const [playersNames, setPlayersName] = useState([]);
	const _emptyPlayer = useMemo(() => {
		return {
			name: "",
			playedMatch: false,
			attended: false,
			owes: [],
			totalPaid: 0,
			totalShouldHavePaid: 0,
		};
	}, []);
	const _initialPlayers = useMemo(
		() =>
			playersNames.map((name) => ({
				..._emptyPlayer,
				name,
			})),
		[playersNames, _emptyPlayer]
	);
	const _initialCosts = useMemo(
		() => [
			{
				name: "League Dues",
				cost: 60,
				sharedBy: [],
				paidBy: null,
				currentlyEditing: false,
			},
			{
				name: "Table Fees",
				cost: null,
				sharedBy: [],
				paidBy: null,
				currentlyEditing: false,
			},
		],
		[]
	);

	const _teamName = urlParams.get("team");
	const [formState, setFormState] = useState(0);
	const [players, setPlayers] = useState(_initialPlayers);
	const [teamName, setTeamName] = useState(_teamName);
	const [teamNumber, setTeamNumber] = useState("");
	const [costs, setCosts] = useState(_initialCosts);
	const [currentWeek, setCurrentWeek] = useState("");
	const [addingCost, setAddingCost] = useState(false);
	const [newCost, setNewCost] = useState({
		name: "",
		cost: 0,
		sharedBy: [],
		paidBy: "",
	});
	const [settings, setSettings] = useState({
		useHubMethod: true,
	});
	const [manageTeamModal, setManageTeamModal] = useState(false);

	const togglePlayerPlayedMatch = (name) => {
		setPlayers((prev) =>
			prev.map((player) =>
				player.name === name
					? { ...player, playedMatch: !player.playedMatch, attended: true }
					: player
			)
		);
	};

	const togglePlayerAttended = (name) => {
		setPlayers((prev) =>
			prev.map((player) =>
				player.name === name
					? { ...player, attended: !player.attended }
					: player
			)
		);
	};

	const toggleCostEditing = (costName) => {
		setCosts((prev) =>
			prev.map((cost) =>
				cost.name === costName
					? { ...cost, currentlyEditing: !cost.currentlyEditing }
					: cost
			)
		);
	};

	const assignPayerToCost = (playerName, costName) => {
		setCosts((prev) =>
			prev.map((cost) =>
				cost.name === costName ? { ...cost, paidBy: playerName } : cost
			)
		);
	};

	const assignAmountToCost = (costName, costAmount) => {
		setCosts((prev) =>
			prev.map((cost) =>
				cost.name === costName ? { ...cost, cost: costAmount } : cost
			)
		);
	};

	const addRecipientsToCost = (players, costName) => {
		const playerNames = players.map((player) => player.name);

		setCosts((prev) =>
			prev.map((cost) =>
				cost.name === costName
					? {
							...cost,
							sharedBy: [...new Set([...cost.sharedBy, ...playerNames])],
							splitAmount:
								cost.cost / new Set([...cost.sharedBy, ...playerNames]).size,
					  }
					: cost
			)
		);
	};

	const removeAllCostSharers = (costName) => {
		setCosts((prev) =>
			prev.map((cost) =>
				cost.name === costName ? { ...cost, sharedBy: [] } : cost
			)
		);
	};

	const addNewCost = (costName, costAmount, sharedBy, paidBy) => {
		setCosts((prev) => [
			...prev,
			{
				name: costName,
				cost: costAmount,
				sharedBy: sharedBy,
				paidBy: paidBy,
			},
		]);
	};
	const handleCreateCost = () => {
		try {
			if (!newCost.name) {
				throw new Error("Cost name is required");
			}
			if (!newCost.cost || newCost.cost <= 0) {
				throw new Error("Cost amount must be a positive number");
			}
			if (!newCost.paidBy) {
				throw new Error("Please select who paid for this cost");
			}
			addNewCost(newCost.name, newCost.cost, newCost.sharedBy, newCost.paidBy);
			setNewCost({ name: "", cost: 0, sharedBy: [], paidBy: "" });
		} catch (error) {
			alert(error.message);
			console.error("Error adding new cost:", error);
		}
	};

	const removeCost = (costName) => {
		setCosts((prev) => prev.filter((cost) => cost.name !== costName));
	};

	const addOwesToPlayers = (personWhoOwes, costAmount, personWhoIsOwed) => {
		setPlayers((prev) =>
			prev.map((player) =>
				player.name === personWhoOwes
					? {
							...player,
							owes: player.owes.some((owe) => owe.payee === personWhoIsOwed)
								? player.owes.map((owe) =>
										owe.payee === personWhoIsOwed
											? { ...owe, amount: owe.amount + costAmount }
											: owe
								  )
								: [
										...player.owes,
										{
											amount: costAmount,
											owedTo: personWhoIsOwed,
										},
								  ],
					  }
					: player
			)
		);
	};

	const assignOwes = () => {
		// Clear existing owes first
		setPlayers((prev) => prev.map((player) => ({ ...player, owes: [] })));

		if (!settings.useHubMethod) {
			console.log("using the simple method");
			// Assign owes directly
			console.log("about to assign owes - costs: ", costs);
			costs.forEach((cost) => {
				cost.sharedBy.forEach((person) => {
					addOwesToPlayers(
						person,
						cost.cost / cost.sharedBy.length,
						cost.paidBy
					);
				});
			});
			console.log("finished assign owes - costs: ", players);

			return;
		}
		console.log("using hub method");
		// Calculate total amount paid by each person
		const totalPaid = {};
		costs.forEach((cost) => {
			totalPaid[cost.paidBy] = (totalPaid[cost.paidBy] || 0) + cost.cost;
		});
		console.log({ costs });
		console.log({ totalPaid });
		// Add totalPaid to each player
		setPlayers((prev) =>
			prev.map((player) => ({
				...player,
				totalPaid: totalPaid[player.name] || 0,
			}))
		);

		// Calculate what each person should have paid based on their shares
		const shouldHavePaid = {};
		costs.forEach((cost) => {
			const perPersonShare = cost.cost / cost.sharedBy.length;
			cost.sharedBy.forEach((person) => {
				shouldHavePaid[person] = (shouldHavePaid[person] || 0) + perPersonShare;
			});
		});
		console.log({ shouldHavePaid });
		// Add shouldHavePaid to each player
		setPlayers((prev) =>
			prev.map((player) => ({
				...player,
				totalShouldHavePaid: shouldHavePaid[player.name] || 0,
			}))
		);
		// add totalPaid to players

		// Calculate initial net balances
		const netBalances = {};
		Object.keys(shouldHavePaid).forEach((person) => {
			console.log({ person });
			console.log(
				"expected net balance",
				(totalPaid[person] || 0) - shouldHavePaid[person]
			);
			netBalances[person] = (totalPaid[person] || 0) - shouldHavePaid[person];
		});
		console.log({ netBalances });
		// Settle mutual debts first
		const people = Object.keys(netBalances);
		for (let i = 0; i < people.length; i++) {
			for (let j = i + 1; j < people.length; j++) {
				const person1 = people[i];
				const person2 = people[j];

				// If they owe in opposite directions
				if (netBalances[person1] > 0 && netBalances[person2] < 0) {
					const settlement = Math.min(
						netBalances[person1],
						-netBalances[person2]
					);
					netBalances[person1] -= settlement;
					netBalances[person2] += settlement;
					if (settlement > 0) {
						addOwesToPlayers(person2, settlement, person1);
					}
				} else if (netBalances[person1] < 0 && netBalances[person2] > 0) {
					const settlement = Math.min(
						-netBalances[person1],
						netBalances[person2]
					);
					netBalances[person1] += settlement;
					netBalances[person2] -= settlement;
					if (settlement > 0) {
						addOwesToPlayers(person1, settlement, person2);
					}
				}
			}
		}

		// Find the person who is still owed the most (the hub) for remaining debts
		const hub = Object.entries(netBalances).reduce(
			(max, [person, balance]) =>
				balance > (max?.balance || -Infinity) ? { person, balance } : max,
			null
		)?.person;

		if (!hub) return;

		// Calculate and assign remaining debts through the hub
		Object.entries(netBalances).forEach(([person, balance]) => {
			if (person !== hub && balance < 0) {
				const amountOwed = Math.abs(balance);
				if (amountOwed > 0) {
					addOwesToPlayers(person, amountOwed, hub);
				}
			}
		});
	};

	const generateOwsString = () => {
		// Generate a concise summary string
		console.log("About to consolidate who owes who");
		console.log(players);
		let summary = "";
		// Loop through each player to build their summary string
		players.forEach((player) => {
			console.log(player, player.totalPaid, player.totalShouldHavePaid);
			let balanceString = `${
				player.totalPaid > player.totalShouldHavePaid
					? "Should receive "
					: "Owes "
			} a total of $${Math.abs(
				player.totalShouldHavePaid - player.totalPaid
			).toFixed(2)}\n`;
			let oweString = `${player.name}: ${balanceString}`;

			// Combine all debts by person owed to, summing up amounts
			const consolidatedDebts = player.owes.reduce((acc, owe) => {
				acc[owe.owedTo] = (acc[owe.owedTo] || 0) + owe.amount;
				return acc;
			}, {});

			// Convert debts object to array of [owedTo, amount] pairs
			const debts = Object.entries(consolidatedDebts);

			// Filter out self-debts and zero amounts
			const realDebts = debts.filter(
				([owedTo, amount]) => owedTo !== player.name && amount > 0
			);

			if (realDebts.length === 0) {
				oweString += "nothing";
			} else {
				// Format each debt as "amount to person"
				oweString += realDebts
					.map(([owedTo, amount]) => `- ${amount.toFixed(2)} to ${owedTo}`)
					.join("\n");
			}
			if (oweString.indexOf("nothing") === -1) {
				summary += oweString + "\n\n";
			}
		});

		if (summary.trim() === "") {
			throw new Error(
				"No debts to summarize. Please check your cost allocations."
			);
		}
		// if someone owes nothing, remove them from the summary
		return summary;
	};
	const copyWhoOwesWho = () => {
		const message = generateOwsString();
		// Decode URL encoded text if needed
		const decodedMessage = decodeURIComponent(message);
		navigator.clipboard.writeText(decodedMessage).then(
			() => {
				alert("Summary copied to clipboard!");
			},
			(err) => {
				console.error("Could not copy text: ", err);
				alert("Failed to copy to clipboard. Please try again.");
			}
		);
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
	const handlePrevState = () => {
		const formContainer = document.querySelector(".page");
		if (formContainer) {
			formContainer.scrollIntoView({ behavior: "smooth" });
		}
		setFormState(formState - 1);
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

	const handleGenerateZelleMessage = (teamName, teamNumber, currentWeek) => {
		return `Team Number: ${
			teamNumber ? teamNumber : "Team Number"
		}\nTeam Name: ${teamName ? teamName : "Team Name"}\nWeek # - ${
			currentWeek ? currentWeek : "Week Number"
		}`;
	};
	const handleCopyZelleMessage = (teamName, teamNumber, currentWeek) => {
		let message = handleGenerateZelleMessage(teamName, teamNumber, currentWeek);
		navigator.clipboard.writeText(message).then(
			() => {
				alert("Zelle message copied to clipboard!");
			},
			(err) => {
				console.error("Could not copy text: ", err);
				alert("Failed to copy to clipboard. Please try again.");
			}
		);
	};
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

	const pushStateToUrl = (players, teamName, teamNumber) => {
		const newUrl = new URL(window.location);
		const playersNames = players.map((p) => p.name).join(",");
		newUrl.searchParams.set("teamName", teamName);
		newUrl.searchParams.set("teamNumber", teamNumber);
		newUrl.searchParams.set("players", playersNames);
		window.history.pushState({}, "", newUrl);
	};
	const handleSaveTeam = (players, teamName) => {
		const filteredPlayers = players.filter(
			(player) => player.name.trim() !== ""
		);
		setPlayers(filteredPlayers);
		pushStateToUrl(filteredPlayers, teamName, teamNumber);
		updatePersistentTeamData(filteredPlayers, teamName, teamNumber);
		setManageTeamModal(false);
	};

	// on page reload - handle loading state from localstorage
	useEffect(() => {
		const loadPersistentTeamData = () => {
			// if (hasLoadedFormData.current) {
			const handleLoadingPlayers = (playersNames) => {
				setPlayers((prev) => {
					return playersNames.map((name) => {
						const player = prev.find((player) => player.name === name);
						return player || { ..._emptyPlayer, name };
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
				setPlayersName(playersNamesFromUrl);
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
					setPlayersName(playersNames);
					handleLoadingPlayers(playersNames);
				} catch (e) {
					console.error("Failed to load team data from local storage", e);
				}
			} else {
				console.warn("No team data found in URL or local storage");
			}
		};
		// const loadPersistentFormDate = () => {
		// 	// if (hasLoadedTeamData.current) {
		// 	const rawFormData = localStorage.getItem("persistentFormState");
		// 	if (rawFormData) {
		// 		const formData = JSON.parse(rawFormData);
		// 		console.log("Found the form data fro local storage", formData);
		// 		if (
		// 			formData.players &&
		// 			formData.costs &&
		// 			formData.formState !== undefined
		// 		) {
		// 			if (
		// 				JSON.stringify(formData.players) !==
		// 					JSON.stringify([_emptyPlayer]) &&
		// 				JSON.stringify(formData.costs) !== JSON.stringify(_initialCosts) &&
		// 				formState === 0
		// 			) {
		// 				console.log("FORM STATE IS INITIAL STATE: DO NOTHING");
		// 			} else {
		// 				setPlayers(formData.players);
		// 				setCosts(formData.costs);
		// 				setFormState(formData.formState);
		// 			}
		// 		} else {
		// 			console.log("Invalid form data");
		// 		}
		// 	} else {
		// 		console.log("No form data found");
		// 	}
		// 	hasLoadedTeamData.current = true;
		// 	// } else {
		// 	// console.log("TEAM: execution skipped, already ran");
		// 	// return;
		// 	// }
		// };
		// console.log("starting load");
		// console.log("EXECUTE loadPersistentTeamData");
		loadPersistentTeamData();
		// console.log("EXECUTE loadPersistentFormDate");
		// loadPersistentFormDate();
		console.log("finished loading");
	}, []);

	const updatePersistentTeamData = (players, team, teamNumber) => {
		// console.log("updating persistent data");
		localStorage.setItem(
			"persistentTeamState",
			JSON.stringify({ players, team, teamNumber })
		);
	};
	// useEffect(() => {
	// 	console.log("we have a new player (playerNamesChanged)");
	// 	setPlayers((prev) => {
	// 		return playersNames.map((name) => {
	// 			const player = prev.find((player) => player.name === name);
	// 			return player || { ..._emptyPlayer, name };
	// 		});
	// 	});
	// }, [playersNames]);
	// save any changes to form as they happen
	useEffect(() => {
		const updatePersistentFormData = (players, costs, formState) => {
			try {
				let state = { players, costs, formState };
				let initialState = {
					players: [],
					costs: _initialCosts,
					formState: 0,
				};
				// console.log("DEFAULTS", initialState);
				// console.log("seeing if the form state is default", state, initialState);
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
		// console.log("something changed in the state");
		// console.log("EXECUTE updatePersistentFormData");
		updatePersistentFormData(players, costs, formState);
	}, [players, costs, formState, _initialPlayers, _initialCosts]);

	const clearForm = () => {
		const clearedPlayers = players.map((player) => ({
			...player,
			playedMatch: false,
			attended: false,
			owes: [],
		}));
		setPlayers(clearedPlayers);
		setCosts(_initialCosts);
		setFormState(0);
		localStorage.removeItem("persistentFormState");
	};

	const renderPlayerForm = () => (
		<div className="player-form">
			<h2 className="form-title">Player Attendance</h2>
			<div className="player-header">
				<span className="player-name">Player Name</span>
				<span className="checkbox-label">Played</span>
				<span className="checkbox-label">Attended</span>
			</div>
			{players.map((player) => (
				<div key={player.name} className="player-item">
					<span className="player-name">{player.name}</span>
					<label className="checkbox-label">
						<input
							type="checkbox"
							checked={player.playedMatch}
							onChange={() => togglePlayerPlayedMatch(player.name)}
							className="checkbox-input"
						/>
						<span className="hidden">Played Match</span>
					</label>
					<label className="checkbox-label">
						<input
							type="checkbox"
							checked={player.attended}
							onChange={() => togglePlayerAttended(player.name)}
							className="checkbox-input"
						/>
						<span className="hidden">Attended</span>
					</label>
				</div>
			))}
			<h3>League Dues</h3>
			<select
				onChange={(e) => assignPayerToCost(e.target.value, "League Dues")}
				className="payer-select">
				<option value="">Who Paid the League Dues?</option>
				{players.map((player) => (
					<option key={player.name} value={player.name}>
						{player.name}
					</option>
				))}
			</select>
			<h3>Table Fees</h3>
			<select
				onChange={(e) => assignPayerToCost(e.target.value, "Table Fees")}
				className="payer-select">
				<option value="">Who Paid the Table Fees?</option>
				{players.map((player) => (
					<option key={player.name} value={player.name}>
						{player.name}
					</option>
				))}
			</select>
			<input
				type="number"
				placeholder="Table Fees Amount"
				onChange={(e) =>
					assignAmountToCost("Table Fees", parseFloat(e.target.value))
				}
			/>
		</div>
	);

	const renderCostForm = () => (
		<div className="cost-form">
			<h2 className="form-title">Assign Additional Costs</h2>
			{costs.map((cost, index) => (
				<div key={index} className="cost-item">
					{!cost.currentlyEditing ? (
						<div className="cost-summary">
							<div className="flex justify-between">
								<h3 className="cost-name">
									{cost.name} - ${cost.cost}
								</h3>
								<button
									onClick={() => toggleCostEditing(cost.name)}
									className="edit-cost-btn">
									Edit
								</button>
							</div>
							<p>Paid by: {cost.paidBy || "Not assigned"}</p>
							<p>Shared by: {cost.sharedBy.length} players</p>
						</div>
					) : (
						<>
							<div className="flex justify-between">
								<h3 className="cost-name">
									{cost.name} - ${cost.cost}
								</h3>
								<button
									onClick={() => removeCost(cost.name)}
									className="remove-cost-btn"
									style={{ height: 50 }}>
									Remove Cost
								</button>
							</div>
							<input
								type="number"
								placeholder="Cost Amount"
								value={cost.cost}
								onChange={(e) => {
									assignAmountToCost(cost.name, parseFloat(e.target.value));
								}}
							/>
							<input
								type="text"
								placeholder="Name"
								value={cost.name}
								onChange={(e) => {
									setCosts((prevCosts) =>
										prevCosts.map((c) =>
											c.name === cost.name ? { ...c, name: e.target.value } : c
										)
									);
								}}
							/>
							<select
								onChange={(e) => assignPayerToCost(e.target.value, cost.name)}
								className="payer-select"
								value={cost.paidBy || ""}>
								<option value="">Select Payer</option>
								{players.map((player) => (
									<option key={player.name} value={player.name}>
										{player.name}
									</option>
								))}
							</select>

							<div className="player-selection">
								<h4 className="selection-title">Select Players:</h4>
								<div className="recipient-buttons">
									<button
										onClick={() =>
											addRecipientsToCost(
												players.filter((player) => player.playedMatch),
												cost.name
											)
										}
										className="all-players-btn">
										All Match Players
									</button>
									<button
										onClick={() =>
											addRecipientsToCost(
												players.filter((player) => player.attended),
												cost.name
											)
										}
										className="all-attendees-btn">
										All Attendees
									</button>
									<button
										onClick={() => removeAllCostSharers(cost.name)}
										className="clear-players-btn error-btn">
										Clear All Players
									</button>
								</div>
								{players.map((player) => (
									<label key={player.name} className="player-checkbox-label">
										<input
											type="checkbox"
											checked={cost.sharedBy.includes(player.name)}
											onChange={() => {
												const updatedSharedBy = cost.sharedBy.includes(
													player.name
												)
													? cost.sharedBy.filter((name) => name !== player.name)
													: [...cost.sharedBy, player.name];
												setCosts((prevCosts) =>
													prevCosts.map((c) =>
														c.name === cost.name
															? { ...c, sharedBy: updatedSharedBy }
															: c
													)
												);
											}}
											className="player-checkbox"
										/>
										{player.name}
									</label>
								))}
							</div>
							<button
								onClick={() => toggleCostEditing(cost.name)}
								className="done-editing-btn success-btn btn-success">
								Done Editing
							</button>
						</>
					)}
				</div>
			))}
			<div className="box">
				<h3 className="add-cost-title">Add New Cost</h3>
				{addingCost ? (
					<div className="add-cost-form">
						<input
							type="text"
							placeholder="Cost Name"
							value={newCost.name}
							onChange={(e) => setNewCost({ ...newCost, name: e.target.value })}
							className="cost-name-input"
						/>
						<select
							onChange={(e) =>
								setNewCost({ ...newCost, paidBy: e.target.value })
							}
							className="cost-payer-select">
							<option value="">Select Payer</option>
							{players.map((player) => (
								<option key={player.name} value={player.name}>
									{player.name}
								</option>
							))}
						</select>
						<input
							type="number"
							placeholder="Cost Amount"
							value={newCost.cost}
							onChange={(e) =>
								setNewCost({ ...newCost, cost: parseFloat(e.target.value) })
							}
							className="cost-amount-input"
						/>

						<div className="player-selection">
							<h4 className="selection-title">Select Players:</h4>
							<div className="recipient-buttons">
								<button
									onClick={() => {
										const matchPlayers = players
											.filter((player) => player.playedMatch)
											.map((player) => player.name);
										setNewCost((prev) => ({
											...prev,
											sharedBy: [
												...new Set([...prev.sharedBy, ...matchPlayers]),
											],
										}));
									}}
									className="all-players-btn">
									All Match Players
								</button>
								<button
									onClick={() => {
										const attendees = players
											.filter((player) => player.attended)
											.map((player) => player.name);
										setNewCost((prev) => ({
											...prev,
											sharedBy: [...new Set([...prev.sharedBy, ...attendees])],
										}));
									}}
									className="all-attendees-btn">
									All Attendees
								</button>
								<button
									onClick={() =>
										setNewCost((prev) => ({ ...prev, sharedBy: [] }))
									}
									className="clear-players-btn error-btn">
									Clear All Players
								</button>
							</div>
							{players.map((player) => (
								<label key={player.name} className="player-checkbox-label">
									<input
										type="checkbox"
										checked={newCost.sharedBy.includes(player.name)}
										onChange={() => {
											setNewCost((prev) => {
												const updatedSharedBy = prev.sharedBy.includes(
													player.name
												)
													? prev.sharedBy.filter((name) => name !== player.name)
													: [...prev.sharedBy, player.name];
												return {
													...prev,
													sharedBy: updatedSharedBy,
												};
											});
										}}
										className="player-checkbox"
									/>
									{player.name}
								</label>
							))}
						</div>
						<button
							onClick={() => {
								handleCreateCost();
								setAddingCost(false);
							}}
							className="add-cost-btn mt-4">
							Add Cost
						</button>
					</div>
				) : (
					<>
						<button
							onClick={() => {
								setAddingCost(true);
							}}
							className="add-cost-btn">
							Add Cost
						</button>
					</>
				)}
			</div>
			<div className="settings-footer">
				<label className="settings-toggle">
					<input
						type="checkbox"
						checked={settings.useHubMethod}
						onChange={() =>
							setSettings((prev) => ({
								...prev,
								useHubMethod: !prev.useHubMethod,
							}))
						}
					/>
					<span>Use Hub Method for Debt Consolidation</span>
				</label>
			</div>
		</div>
	);

	const renderSummary = () => (
		<div className="summary">
			<h2 className="result-title">Result</h2>
			<h3 className="summary-title">Team Dues Info</h3>
			<div className="zelle-info-box">
				<p className="zelle-instructions">
					Please Zelle <span className="zelle-amount">$60</span> to{" "}
					<span className="zelle-email">{leagueZelleEmail}</span>
				</p>
				<p className="zelle-subject-instructions">
					In the subject include:
					<span className="zelle-subject">
						{handleGenerateZelleMessage(teamName, teamNumber, currentWeek)}
					</span>
				</p>
				<div className="zelle-buttons">
					<button
						className="zelle-copy-btn"
						onClick={() => {
							handleCopyZelleEmail(teamName, teamNumber, currentWeek);
						}}>
						Copy Zelle Email
					</button>
					<button
						className="zelle-copy-btn"
						onClick={() =>
							handleCopyZelleMessage(teamName, teamNumber, currentWeek)
						}>
						Copy Zelle Subject
					</button>
				</div>
				<p>Please always confirm the week is correct</p>
			</div>
			<button
				onClick={() => copyWhoOwesWho()}
				className="full-width success-btn"
				id="copy-who-owes-who-button">
				Copy Who Owes
			</button>
			<div className="payment-summary">
				<h3 className="summary-title">Payment Summary</h3>
				<div className="payment-grid">
					{players.map((player) => (
						<div key={player.name} className="player-payment-summary">
							<h4 className="player-name">{player.name}</h4>
							<div className="payment-details">
								<div>Paid: ${player.totalPaid.toFixed(2)}</div>
								<div>
									Should Have Paid: ${player.totalShouldHavePaid.toFixed(2)}
								</div>
								<div
									className={`balance ${
										player.totalPaid - player.totalShouldHavePaid >= 0
											? "positive"
											: "negative"
									}`}>
									Balance: $
									{(player.totalPaid - player.totalShouldHavePaid).toFixed(2)}
								</div>
							</div>

							<ul className="owes-list">
								{(() => {
									const consolidatedDebts = player.owes.reduce((acc, owe) => {
										acc[owe.owedTo] = (acc[owe.owedTo] || 0) + owe.amount;
										return acc;
									}, {});

									// Get debts this player owes to others
									const debts = Object.entries(consolidatedDebts).filter(
										([owedTo, amount]) => owedTo !== player.name && amount > 0
									);

									// Get debts others owe to this player
									const receivables = players.reduce((acc, otherPlayer) => {
										if (otherPlayer.name === player.name) return acc;

										const amount = otherPlayer.owes.reduce(
											(sum, owe) =>
												owe.owedTo === player.name ? sum + owe.amount : sum,
											0
										);

										if (amount > 0) {
											acc.push([otherPlayer.name, amount]);
										}
										return acc;
									}, []);

									if (debts.length === 0 && receivables.length === 0) {
										return;
									}

									return (
										<div>
											{debts.length ? (
												<>
													<h4 className="subtitle">Who to pay</h4>
													{debts.map(([owedTo, amount], index) => (
														<li key={index} className="owe-item">
															${amount.toFixed(2)} to {owedTo}
														</li>
													))}
												</>
											) : (
												<></>
											)}
											{receivables.length ? (
												<>
													<h4 className="subtitle">Who owes you</h4>
													{receivables.map(([owedBy, amount], index) => (
														<li key={index} className="owe-item">
															${amount.toFixed(2)} from {owedBy}
														</li>
													))}
												</>
											) : (
												<></>
											)}
										</div>
									);
								})()}
							</ul>
						</div>
					))}
				</div>
			</div>
			{/* {players.map((player) => (
				<div key={player.name} className="player-summary">
					<h3 className="player-name">{player.name} Owes</h3>
					<ul className="owes-list">
						{(() => {
							const consolidatedDebts = player.owes.reduce((acc, owe) => {
								acc[owe.owedTo] = (acc[owe.owedTo] || 0) + owe.amount;
								return acc;
							}, {});

							const debts = Object.entries(consolidatedDebts).filter(
								([owedTo, amount]) => owedTo !== player.name && amount > 0
							);

							if (debts.length === 0) {
								return <li className="owe-item">nothing</li>;
							}

							return debts.map(([owedTo, amount], index) => (
								<li key={index} className="owe-item">
									${amount.toFixed(2)} to {owedTo}
								</li>
							));
						})()}
					</ul>
				</div>
			))} */}
			<h3 className="summary-title">Cost Breakdown</h3>
			{costs.map((cost) => (
				<div key={cost.name} className="cost-summary">
					<h4 className="cost-name">{cost.name}</h4>
					<div className="cost-details">Total Cost: ${cost.cost}</div>
					<div className="cost-details">Paid By: {cost.paidBy}</div>
					<div className="cost-details">
						Shared By: {cost.sharedBy.join(", ")}
					</div>
					<div className="cost-details">
						Split Amount: ${(cost.cost / cost.sharedBy.length).toFixed(2)}
					</div>
				</div>
			))}
		</div>
	);
	const renderManageTeamModal = () => (
		<div className="modal-overlay">
			<div className="modal-content">
				<h2>Manage Team</h2>
				<div className="form-group">
					<label htmlFor="teamNumber">Team Number:</label>
					<input
						type="text"
						id="teamNumber"
						value={teamNumber}
						onChange={(e) => setTeamNumber(e.target.value)}
					/>
				</div>
				<div className="form-group">
					<label htmlFor="teamName">Team Name:</label>
					<input
						type="text"
						id="teamName"
						value={teamName}
						onChange={(e) => setTeamName(e.target.value)}
					/>
				</div>
				<button
					onClick={() => {
						setPlayers([...players, { ..._emptyPlayer, name: "" }]);
					}}>
					Add Player
				</button>
				<div className="form-group">
					<label>Players:</label>
					<div style={{ maxHeight: "30vh", overflowY: "auto" }}>
						{players.map((player, index) => (
							<div key={index} className="player-input">
								<input
									type="text"
									value={player.name}
									onChange={(e) => {
										const updatedPlayers = [...players];
										updatedPlayers[index].name = e.target.value;
										setPlayers(updatedPlayers);
									}}
								/>
								<button
									onClick={() => {
										setPlayers(players.filter((_, i) => i !== index));
									}}>
									Remove
								</button>
							</div>
						))}
					</div>
				</div>

				<div className="modal-actions">
					<button
						onClick={() => {
							//check if there are any duplicate names
							const uniqueNames = new Set(players.map((player) => player.name));
							if (uniqueNames.size !== players.length) {
								alert("Two players can't have the same name");
								return;
							}
							handleSaveTeam(players, teamName, teamNumber);
						}}>
						Save
					</button>
					<button onClick={() => setManageTeamModal(false)}>Cancel</button>
				</div>
			</div>
		</div>
	);
	return (
		<div className="app-container">
			<header className="app-header">
				<h4 className="app-title">APA Cost Splitter</h4>
				<div className="flex flex-wrap gap-4 justify-between items-end">
					<div>
						{teamName && <h2 className="team-name">Team {teamName}</h2>}
						<div className="flex gap-2">
							<button onClick={() => setManageTeamModal(!manageTeamModal)}>
								Manage Team
							</button>
						</div>
					</div>
					<button onClick={() => handleCopyShareLink()} id="share-team-button">
						Share Link With Team
					</button>
				</div>
				{manageTeamModal && renderManageTeamModal()}
			</header>
			<div className="sub-header">
				<button
					className="clear-form-button error-btn"
					onClick={() => clearForm()}>
					Start Over
				</button>
			</div>
			<div className="page">
				{formState === 0 && renderPlayerForm()}
				{formState === 1 && renderCostForm()}
				{formState === 2 && renderSummary()}
				<div className="flex gap-2">
					{formState !== 0 && (
						<button
							onClick={() => handlePrevState()}
							className="previous-button">
							Previous
						</button>
					)}
					<button
						onClick={handleNextState}
						className={`next-button ${formState === 2 ? "error-btn" : ""}`}>
						{formState < 2 ? "Next" : "Reset Form"}
					</button>
				</div>
				{/* <div className="state-display">
				<h3>Current State</h3>
				<pre>
					{JSON.stringify(
						{
							players,
							costs,
							newCost,
							formState,
						},
						null,
						2
					)}
				</pre>
			</div> */}
			</div>
			<footer className="footer">
				<a href="mailto:bprobst1029@gmail.com">
					Please direct all feedback or issues here
				</a>
			</footer>
		</div>
	);
}

export default App;
// // Force a re-render when the localstorage is updated
// useEffect(() => {
// 	const cookieValue = Cookies.get("persistentFormState");
// 	if (cookieValue) {
// 		const parsedCookie = JSON.parse(cookieValue);
// 		// Only update state if the values are different
// 		if (JSON.stringify(parsedCookie.players) !== JSON.stringify(players)) {
// 			setPlayers(parsedCookie.players);
// 		}
// 		if (JSON.stringify(parsedCookie.costs) !== JSON.stringify(costs)) {
// 			setCosts(parsedCookie.costs);
// 		}
// 		if (parsedCookie.formState !== formState) {
// 			setFormState(parsedCookie.formState);
// 		}
// 	}
// }, []);
