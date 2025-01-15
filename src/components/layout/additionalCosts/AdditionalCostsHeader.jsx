import PropTypes from "prop-types";

export const AdditionalCostsHeader = ({ handleAddNewCost }) => {
	return (
		<div className="form-title">
			<div className="flex items-center justify-between">
				<h2 className="">Additional Costs</h2>
				<button onClick={() => handleAddNewCost()} className="add-cost-btn">
					Add New
				</button>
			</div>
		</div>
	);
};
AdditionalCostsHeader.propTypes = {
	handleAddNewCost: PropTypes.func.isRequired,
};
