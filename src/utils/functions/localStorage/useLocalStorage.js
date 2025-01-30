import { useState, useEffect, useRef } from "react";

export const useLocalStorage = (key, initialValue) => {
	const isFirstRender = useRef(true);
	const [isInitialized, setIsInitialized] = useState(false);

	// Get stored value or use initialValue
	const [storedValue, setStoredValue] = useState(() => {
		try {
			const item = window.localStorage.getItem(key);
			console.log(`[${key}] Initial load:`, {
				from: "localStorage",
				value: item,
			}); // DEBUG

			let value = initialValue;
			if (item) {
				try {
					value = JSON.parse(item);
					console.log(`[${key}] Parsed value:`, value); // DEBUG
				} catch {
					window.localStorage.removeItem(key);
				}
			} else {
				console.log(`[${key}] Using initial value:`, initialValue); // DEBUG
			}

			// Mark as initialized after initial load
			setIsInitialized(true);
			return value;
		} catch (error) {
			console.error("Error reading from localStorage:", error);
			setIsInitialized(true);
			return initialValue;
		}
	});

	useEffect(() => {
		if (isFirstRender.current) {
			isFirstRender.current = false;
			return;
		}

		console.log(`[${key}] State update:`, {
			value: storedValue,
			stack: new Error().stack,
		}); // DEBUG with stack trace

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

	return [storedValue, setStoredValue, isInitialized];
};
