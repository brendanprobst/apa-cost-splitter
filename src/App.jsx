import { TeamProvider } from "./providers/team/TeamProvider.jsx";
import { CostFormPage } from "./pages/CostFormPage.jsx";
import { CostsProvider } from "./providers/costs/CostsProvider.jsx";
import { GlobalProvider } from "./providers/global/GlobalProvider.jsx";

export const App = () => {
	return (
		<div>
			<GlobalProvider>
				<TeamProvider>
					<CostsProvider>
						<CostFormPage />
					</CostsProvider>
				</TeamProvider>
			</GlobalProvider>
		</div>
	);
};
