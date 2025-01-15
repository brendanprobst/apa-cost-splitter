import PropTypes from "prop-types";
export const CostBreakdownCard = ({ cost }) => {
	return (
		<div key={cost.name} className="cost-summary">
			<h4 className="cost-name">{cost.name}</h4>
			<div className="cost-details">Total Cost: ${cost.cost}</div>
			<div className="cost-details">Paid By: {cost.paidBy}</div>
			<div className="cost-details">Shared By: {cost.sharedBy.join(", ")}</div>
			<div className="cost-details">
				Split Amount: ${(cost.cost / cost.sharedBy.length).toFixed(2)}
			</div>
		</div>
	);
};
CostBreakdownCard.propTypes = {
	cost: PropTypes.object.isRequired,
};
