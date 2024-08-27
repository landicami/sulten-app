import { restaurantCol } from "../service/firebase";
import useStreamDocument from "./useStreamDocument";

const useRestaurant = (restaurantId: string | undefined) => {
	return useStreamDocument(restaurantCol, restaurantId);
};

export default useRestaurant;
