import { useContext } from "react";
import { CostsContext } from "./CostsContext";

export const useCosts = () => {
	return useContext(CostsContext);
};
