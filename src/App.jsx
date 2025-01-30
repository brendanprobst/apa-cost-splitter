import { AppFooter } from "./components/layout/AppFooter.jsx";
import { GlobalProvider } from "./providers/global/globalProvider.jsx";
import { AppRouter } from "./router/AppRouter.jsx";

export const App = () => {
	return (
		<div className="app-container">
			<GlobalProvider>
				<AppRouter />
				<AppFooter />
			</GlobalProvider>
		</div>
	);
};
