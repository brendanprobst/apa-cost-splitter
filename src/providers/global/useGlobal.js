import { useContext } from "react";
import { GlobalContext } from "./globalContext";

export const useGlobal = () => {
	return useContext(GlobalContext);
};
