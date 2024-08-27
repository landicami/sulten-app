import useStreamCollection from "./useStreamCollection";
import { restaurantCol } from "../service/firebase";
import { where } from "firebase/firestore";

const useAdminRestaurants = () => {
	return useStreamCollection(restaurantCol);
	// where("approvedByAdmin", "==", "false"));
};

export default useAdminRestaurants;
