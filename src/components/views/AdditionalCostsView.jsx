import { useState } from "react";

import { useCosts } from "../../providers/costs/useCosts";
import { AdditionalCostsHeader } from "../layout/additionalCosts/AdditionalCostsHeader";
import { CostCard } from "../cards/CostCard";
import { AdvancedCostSplitInfo } from "../layout/additionalCosts/AdvancedCostSplitInfo";
import { CostForm } from "../forms/CostForm";

import { emptyCost } from "../../utils/constants/costs/emptyCost";

export const AdditionalCostsView = () => {
	const { costs, setCosts } = useCosts();
	const [formCost, setFormCost] = useState();
	const [addingCost, setAddingCost] = useState(false);

	const handleSuccessSaveCost = (_cost) => {
		console.log("cost to save", _cost);
		if (_cost.id === 0) {
			setCosts((prev) => [
				...prev,
				{
					id: Math.max(...costs.map((cost) => cost.id), 0) + 1,
					name: _cost.name,
					cost: _cost.cost,
					sharedBy: _cost.sharedBy,
					paidBy: _cost.paidBy,
				},
			]);
		} else {
			// updating an existing cost based on id
			const updatedCosts = costs.map((cost) => {
				if (cost.id === _cost.id) {
					return {
						...cost,
						name: _cost.name,
						cost: _cost.cost,
						sharedBy: _cost.sharedBy,
						paidBy: _cost.paidBy,
					};
				}
				return cost;
			});
			setCosts(updatedCosts);
		}
		setAddingCost(false);
	};
	const handleErrorSaveCost = (message) => {
		window.alert(message);
	};

	const handleOpenForm = (costId) => {
		if (!costId) {
			setFormCost(emptyCost);
		} else {
			const costToEdit = costs.find((cost) => cost.id === costId);
			console.log("cost to edit", costToEdit);
			setFormCost(costToEdit);
		}
		setAddingCost(true);
	};

	return (
		<div className="cost-form scroll-target">
			<AdditionalCostsHeader handleAddNewCost={() => handleOpenForm()} />
			<AdvancedCostSplitInfo />

			{costs?.map((cost, index) => (
				<div key={index}>
					<CostCard
						cost={cost}
						handleEditCost={(costId) => handleOpenForm(costId)}
					/>
				</div>
			))}

			{addingCost ? (
				<div className="modal-overlay" onClick={(e) => e.stopPropagation()}>
					<div
						className="modal-content"
						style={{ maxHeight: "90vh", overflowY: "auto" }}>
						<CostForm
							initialCost={formCost}
							setIsOpen={setAddingCost}
							onSuccess={(_cost) => handleSuccessSaveCost(_cost)}
							onError={(errorMessage) => handleErrorSaveCost(errorMessage)}
						/>
					</div>
				</div>
			) : (
				<></>
			)}
		</div>
	);
};
