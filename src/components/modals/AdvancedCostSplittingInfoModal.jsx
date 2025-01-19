import PropTypes from "prop-types";

export const AdvancedCostSplittingInfoModal = ({ isOpen, setIsOpen }) => {
	if (!isOpen) return <></>;
	return (
		<div className="modal-overlay">
			<div className="modal-content">
				<h2>Advanced Cost Splitting</h2>
				<h3>
					<i>Advanced Cost Splitting</i> will consolidate debts to minimize the
					number of transactions needed to settle up. This is useful when
					multiple players paid for shared costs.
				</h3>
				<p>
					For example, if Player A owes Player B $10 and Player B owes Player C
					$10, the system will consolidate these debts so that Player A pays
					Player C $10 directly.
				</p>
				<p className="subtle">
					Please note that this feature is experimental and may not always
					produce the most optimal results. When in doubt, please use the{" "}
					<b>Paid</b> and <b>Should Have Paid</b> values to verify the results.
					If you encounter any issues, please{" "}
					<a href="mailto:bprobst1029@gmail.com">contact me</a>.
				</p>
				<div className="form-actions">
					<button onClick={() => setIsOpen(false)}>Close</button>
				</div>
			</div>
		</div>
	);
};
AdvancedCostSplittingInfoModal.propTypes = {
	isOpen: PropTypes.bool,
	setIsOpen: PropTypes.func.isRequired,
};
