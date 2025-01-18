import { useState, useEffect } from "react";

export const useLocalStorage = (key, initialValue) => {
	// Get stored value or use initialValue
	const [storedValue, setStoredValue] = useState(() => {
		try {
			const item = window.localStorage.getItem(key);
			// Check if item exists and is not undefined/null
			if (!item) {
				return initialValue;
			}

			// Try to parse, return initialValue if parsing fails
			try {
				return JSON.parse(item);
			} catch {
				// If there's invalid JSON in localStorage, remove it and return initialValue
				window.localStorage.removeItem(key);
				return initialValue;
			}
		} catch (error) {
			console.error("Error reading from localStorage:", error);
			return initialValue;
		}
	});

	// Update localStorage when state changes
	useEffect(() => {
		try {
			if (storedValue === undefined) {
				window.localStorage.removeItem(key);
			} else {
				window.localStorage.setItem(key, JSON.stringify(storedValue));
			}
		} catch (error) {
			console.error("Error writing to localStorage:", error);
		}
	}, [key, storedValue]);

	return [storedValue, setStoredValue];
};
