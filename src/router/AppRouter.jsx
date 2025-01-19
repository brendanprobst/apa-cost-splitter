import { BrowserRouter, Route, Routes } from "react-router";
import { CostFormPage } from "../pages/CostFormPage";
import { TeamProvider } from "../providers/team/TeamProvider";
import { CostsProvider } from "../providers/costs/CostsProvider";
import { HomePage } from "../pages/HomePage";

export const AppRouter = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<HomePage />}></Route>
				<Route
					path="/team"
					element={
						<TeamProvider>
							<CostsProvider>
								<CostFormPage />
							</CostsProvider>
						</TeamProvider>
					}></Route>
			</Routes>
		</BrowserRouter>
	);
};
