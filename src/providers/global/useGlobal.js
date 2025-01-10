import { useContext } from "react";
import { GlobalContext } from "./GlobalContext";

export const useGlobal = () => {
	return useContext(GlobalContext);
};
