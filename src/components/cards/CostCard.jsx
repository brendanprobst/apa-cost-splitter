import PropTypes from "prop-types";
import { useCosts } from "../../providers/costs/useCosts";

export const CostCard = ({ cost, handleEditCost }) => {
	const { setCosts } = useCosts();
	const handleDeleteCost = (costId) => {
		setCosts((prev) => prev.filter((c) => c.id !== costId));
	};
	return (
		<div id={`cost-${cost.id}`} className="cost-card">
			<div className="cost-summary">
				<div className="flex justify-between">
					<h3 className="cost-name">
						{cost.name} - ${cost.cost}
					</h3>
				</div>
				<p>Paid by: {cost.paidBy || "Not assigned"}</p>
				<p>
					Shared by:{" "}
					{cost.sharedBy.map((player, idx) => {
						if (idx !== cost.sharedBy.length - 1) {
							return `${player}, `;
						} else {
							return `${player}`;
						}
					})}
				</p>
				<div className="cost-card-footer">
					<button
						onClick={() => handleDeleteCost(cost.id)}
						className="delete-cost-btn">
						Delete
					</button>
					<button
						onClick={() => handleEditCost(cost.id)}
						className="edit-cost-btn">
						Edit
					</button>
				</div>
			</div>
			{/* {editingCost ? (
				<div className="modal-overlay" onClick={(e) => e.stopPropagation()}>
					<div
						className="modal-content"
						style={{ maxHeight: "90vh", overflowY: "auto" }}>
						<CostForm
							existingCost={cost}
							setIsOpen={setEditingCost}
							onSuccess={(_cost) => handleSaveCost(_cost)}
							onError={(message) => handleFailedEditCost(message)}
						/>
					</div>
				</div>
			) : (
				<></>
			)} */}
		</div>
	);
};
CostCard.propTypes = {
	cost: PropTypes.object.isRequired,
	handleEditCost: PropTypes.func.isRequired,
};
