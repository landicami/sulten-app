import useStreamCollection from "./useStreamCollection";
import { restaurantCol } from "../service/firebase";
import { orderBy, where } from "firebase/firestore";

const useAdminRestaurants = () => {
	return useStreamCollection(restaurantCol, where("approvedByAdmin", "==", true), orderBy("name"));
};

export default useAdminRestaurants;
