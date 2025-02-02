import { AppFooter } from "./components/layout/AppFooter.jsx";
import { AppProvider } from "./providers/app/AppProvider.jsx";
import { AppRouter } from "./router/AppRouter.jsx";

export const App = () => {
	return (
		<div className="app-container">
			<AppProvider>
				<AppRouter />
				<AppFooter />
			</AppProvider>
		</div>
	);
};
