import { TeamProvider } from "./providers/team/TeamProvider.jsx";
import { CostFormPage } from "./pages/CostFormPage.jsx";

export const App = () => {
	return (
		<div>
			<TeamProvider>
				<CostFormPage />
			</TeamProvider>
		</div>
	);
};
