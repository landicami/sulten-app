import useStreamCollection from "./useStreamCollection";
import { restaurantCol } from "../service/firebase";
import { where } from "firebase/firestore";

const useTipsRestaurants = () => {
	return useStreamCollection(restaurantCol, where("approvedByAdmin", "==", false));
};

export default useTipsRestaurants;
