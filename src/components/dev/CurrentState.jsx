import { useTeam } from "../../providers/team/useTeam";

export const CurrentState = () => {
	const { teamName, teamNumber, players } = useTeam();
	// costs,
	// newCost,
	// formState,
	return (
		<div className="state-display">
			<h3>Current State</h3>
			<pre>
				{JSON.stringify(
					{
						teamName,
						teamNumber,
						players,
					},
					null,
					2
				)}
			</pre>
		</div>
	);
};
