import { useCosts } from "../../providers/costs/useCosts";
import { useApp } from "../../providers/app/useApp";
import { useTeam } from "../../providers/team/useTeam";

export const CurrentState = () => {
	const { team, players } = useTeam();
	const { costs } = useCosts();
	const { allTeams, formState } = useApp();
	// costs,
	// newCost,
	// formState,
	return (
		<div className="state-display">
			<h3>Current State</h3>
			<pre>
				{JSON.stringify(
					{
						allTeams,
						formState,
						team,
						players,
						costs,
					},
					null,
					2
				)}
			</pre>
		</div>
	);
};
