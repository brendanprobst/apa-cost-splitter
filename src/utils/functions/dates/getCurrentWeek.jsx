import { weeks } from "../../constants/dates/weeks";

export const getCurrentWeek = () => {
	const now = new Date();
	// Add a day to account for matches that end after midnight
	now.setDate(now.getDate() + 1);

	// Find the closest past week
	let closestWeek = null;
	let smallestDiff = Infinity;

	for (const [weekNum, weekDate] of Object.entries(weeks)) {
		// console.log("checking week", weekNum, weekDate);
		const diff = Math.abs(weekDate - now);
		if (weekDate <= now && diff < smallestDiff) {
			// console.log("found a week that is less than now", weekNum, weekDate);
			smallestDiff = diff;
			closestWeek = weekNum;
		}
	}

	return closestWeek || "1"; // Default to week 1 if no past week found
};
