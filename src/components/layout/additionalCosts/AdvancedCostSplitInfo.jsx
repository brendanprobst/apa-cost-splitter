import { useState } from "react";
import { AdvancedCostSplittingInfoModal } from "../../modals/AdvancedCostSplittingInfoModal";
import { useCosts } from "../../../providers/costs/useCosts";
export const AdvancedCostSplitInfo = () => {
	const { settings, setSettings } = useCosts();
	const [
		isAdvancedCostSplittingInfoModalOpen,
		setIsAdvancedCostSplittingInfoModalOpen,
	] = useState(false);
	return (
		<>
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
		</>
	);
};
