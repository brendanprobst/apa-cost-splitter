import { useCosts } from "../../providers/costs/useCosts";
import { useGlobal } from "../../providers/global/useGlobal";
import { useTeam } from "../../providers/team/useTeam";

export const CurrentState = () => {
	const { team, players } = useTeam();
	const { costs } = useCosts();
	const { allTeams, formState } = useGlobal();
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
