import { schedule } from "../../constants/dates/schedule";
function generateWeekListFromSchedule(dayOfWeek) {
	const scheduleInfo = schedule[dayOfWeek];
	const startDate = scheduleInfo.startDate;
	const endDate = scheduleInfo.endDate;
	const skipWeeks = scheduleInfo.skipWeeks;
	const weekList = {};

	let currentDate = new Date(startDate);
	let weekNumber = 1;

	while (currentDate <= endDate) {
		console.log("currentDate", currentDate);
		console.log("skipWeeks", skipWeeks);

		// Check if current date matches any skip week by comparing timestamps
		const isSkipWeek = skipWeeks.some(
			(skipDate) => skipDate.getTime() === currentDate.getTime()
		);

		if (!isSkipWeek) {
			weekList[weekNumber] = new Date(currentDate);
			weekNumber++;
		} else {
			console.log("skipping week", weekNumber);
		}

		// Create new Date object for next week to avoid mutating original
		currentDate = new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000);
	}

	return weekList;
}

export const getCurrentWeek = (dayOfWeek) => {
	console.log("dayOfWeek", dayOfWeek);
	const now = new Date();
	// Add a day to account for matches that end after midnight
	now.setDate(now.getDate() + 1);

	// Find the closest past week
	let closestWeek = null;
	let smallestDiff = Infinity;
	const weeks = generateWeekListFromSchedule(dayOfWeek);
	console.log("weeks", weeks);
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
