import { useState } from "react";
import PropTypes from "prop-types";

import { useTeam } from "../../providers/team/useTeam";
import { emptyCost } from "../../utils/constants/costs/emptyCost";

export const CostForm = ({ initialCost, setIsOpen, onSuccess, onError }) => {
	const { players } = useTeam();
	const [_cost, _setCost] = useState(initialCost);

	const handleCreateCost = () => {
		console.log("internal cost", _cost);
		try {
			if (!_cost.name) {
				throw new Error("Cost name is required");
			}
			if (!_cost.cost || _cost.cost <= 0) {
				throw new Error("Cost amount must be a positive number");
			}
			if (!_cost.paidBy) {
				throw new Error("Please select who paid for this cost");
			}
			onSuccess && onSuccess(_cost);
		} catch (error) {
			onError && onError(error);
			console.error("Error adding new cost:", error);
		}
	};
	const handleCancelAddCost = () => {
		setIsOpen(false);
		_setCost(emptyCost);
	};
	return (
		<div className="add-cost-form">
			<label htmlFor="cost-name" className="cost-name-label">
				Cost Name
			</label>
			<input
				type="text"
				placeholder="Cost Name"
				value={_cost.name}
				onChange={(e) => _setCost({ ..._cost, name: e.target.value })}
				className="cost-name-input"
			/>
			<label htmlFor="cost-payer" className="cost-payer-label">
				Paid By
			</label>
			<select
				onChange={(e) => _setCost({ ..._cost, paidBy: e.target.value })}
				className="cost-payer-select">
				<option value="">Select Payer</option>
				{players.map((player) => (
					<option key={player.name} value={player.name}>
						{player.name}
					</option>
				))}
			</select>
			<label htmlFor="cost-amount" className="cost-amount-label">
				Cost Amount
			</label>
			<input
				type="number"
				placeholder="Cost Amount"
				value={_cost.cost}
				onChange={(e) =>
					_setCost({ ..._cost, cost: parseFloat(e.target.value) })
				}
				className="cost-amount-input"
			/>

			<div className="player-selection">
				<h4 className="selection-title">Select Players:</h4>
				<div className="content">
					<div className="text-subtle">Quick Select</div>
					<div className="helper-buttons">
						<button
							onClick={() => {
								const matchPlayers = players
									.filter((player) => player.playedMatch)
									.map((player) => player.name);
								_setCost((prev) => ({
									...prev,
									sharedBy: [...new Set([...prev.sharedBy, ...matchPlayers])],
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
								_setCost((prev) => ({
									...prev,
									sharedBy: [...new Set([...prev.sharedBy, ...attendees])],
								}));
							}}
							className="all-attendees-btn">
							All Attendees
						</button>
						<button
							onClick={() => _setCost((prev) => ({ ...prev, sharedBy: [] }))}
							className="clear-players-btn error-btn">
							Clear All Players
						</button>
					</div>
					<div className="players-list">
						{players.map((player) => (
							<label key={player.name} className="player-checkbox-label">
								<input
									type="checkbox"
									checked={_cost.sharedBy.includes(player.name)}
									onChange={() => {
										_setCost((prev) => {
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
				</div>
				<div>
					<button
						onClick={() => {
							handleCreateCost();
						}}
						className="add-cost-btn mt-4 mb-4 success-btn w-full">
						Save
					</button>
				</div>
				<button className="error-btn" onClick={() => handleCancelAddCost()}>
					Cancel
				</button>
			</div>
		</div>
	);
};
CostForm.propTypes = {
	initialCost: PropTypes.object,
	setIsOpen: PropTypes.func,
	onSuccess: PropTypes.func,
	onError: PropTypes.func,
};
