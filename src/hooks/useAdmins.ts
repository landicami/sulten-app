import useStreamCollection from "./useStreamCollection";
import { adminCol } from "../service/firebase";

const useAdmins = () => {
	return useStreamCollection(adminCol);
};

export default useAdmins;
