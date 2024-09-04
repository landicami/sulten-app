import { orderBy, where } from "firebase/firestore";
import { restaurantCol } from "../service/firebase";
import useStreamCollection from "./useStreamCollection";

const useCityResturants = (city: string) => {
	return useStreamCollection(
		restaurantCol,
		where("approvedByAdmin", "==", true),
		where("city", "==", city),
		orderBy("name")
	);
};

export default useCityResturants;
