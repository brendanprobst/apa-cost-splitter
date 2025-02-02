import { useState } from "react";
import { TeamCard } from "../components/cards/TeamCard";
import { HomePageHeader } from "../components/layout/HomeHeader";
import { useApp } from "../providers/app/useApp";
import { CreateTeamModal } from "../components/modals/CreateTeamModal";

export const HomePage = () => {
	const { allTeams } = useApp();
	const [isEditing, setIsEditing] = useState(false);
	const [isCreatingTeam, setIsCreatingTeam] = useState(false);
	return (
		<>
			<HomePageHeader />
			<div className="page">
				<div className="form-title flex justify-between items-center pl-4 pr-4 mt-3">
					<h2 className="m-0 ">My Teams</h2>
					<button
						className="zelle-copy-btn"
						onClick={() => setIsEditing(!isEditing)}>
						{isEditing ? "Done" : "Edit"}
					</button>
				</div>
				{isEditing ? (
					<div className="pr-4 pl-4">
						<button
							className="w-full success-btn"
							onClick={() => setIsCreatingTeam(true)}>
							Add New Team
						</button>
						<p className="subtle-text text-center">
							(To edit an existing team, navigate to that team&apos;s page)
						</p>
					</div>
				) : (
					<></>
				)}
				<div className="team-grid">
					{allTeams.length > 0 ? (
						allTeams.map((team) => {
							return (
								<div key={team.number}>
									<TeamCard
										team={team}
										isEditing={isEditing}
										playersNames={team.players}
									/>
								</div>
							);
						})
					) : (
						<div className="flex justify-center items-center h-full">
							<button className="btn" onClick={() => setIsCreatingTeam(true)}>
								Add Team
							</button>
						</div>
					)}
				</div>
			</div>
			<CreateTeamModal isOpen={isCreatingTeam} setIsOpen={setIsCreatingTeam} />
		</>
	);
};
