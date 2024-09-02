import useStreamCollection from "./useStreamCollection";
import { adminCol, restaurantCol } from "../service/firebase";
import { orderBy, where } from "firebase/firestore";

const useAdmins = () => {
	return useStreamCollection(adminCol);
};

export default useAdmins;
