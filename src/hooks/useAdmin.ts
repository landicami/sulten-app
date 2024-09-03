import { where } from "firebase/firestore";
import { adminCol } from "../service/firebase";
import useStreamCollection from "./useStreamCollection";

const useAdmin = (uid: string = "") => {
	return useStreamCollection(adminCol, where("uid", "==", uid));
};

export default useAdmin;
