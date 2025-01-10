import { useState } from "react";
import { useCosts } from "../../providers/costs/useCosts";
import { useTeam } from "../../providers/team/useTeam";
import { useGlobal } from "../../providers/global/useGlobal";
import { AdvancedCostSplittingInfoModal } from "../modals/AdvancedCostSplittingInfoModal";

export const AssignCostsView = () => {
	const { players } = useTeam();
	const {
		costs,
		setCosts,
		assignPayerToCost,
		assignAmountToCost,
		addRecipientsToCost,
	} = useCosts();
	const { settings, setSettings } = useGlobal();
	const [addingCost, setAddingCost] = useState(false);
	const [newCost, setNewCost] = useState({
		name: "",
		cost: 0,
		sharedBy: [],
		paidBy: "",
	});
	const [
		isAdvancedCostSplittingInfoModalOpen,
		setIsAdvancedCostSplittingInfoModalOpen,
	] = useState(false);
	const toggleCostEditing = (costName) => {
		setCosts((prev) =>
			prev.map((cost) =>
				cost.name === costName
					? { ...cost, currentlyEditing: !cost.currentlyEditing }
					: cost
			)
		);
	};

	const removeCost = (costName) => {
		setCosts((prev) => prev.filter((cost) => cost.name !== costName));
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
	return (
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
					<span>
						Use <i>Advanced Cost Splitting</i>
					</span>
				</label>
				<button
					className="btn-link"
					onClick={() => setIsAdvancedCostSplittingInfoModalOpen(true)}>
					What does <i>Advanced Cost Splitting</i> do?
				</button>
			</div>
			<AdvancedCostSplittingInfoModal
				isOpen={isAdvancedCostSplittingInfoModalOpen}
				setIsOpen={setIsAdvancedCostSplittingInfoModalOpen}
			/>
		</div>
	);
};
