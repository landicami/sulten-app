import { doc, updateDoc } from "firebase/firestore";
import { restaurantCol } from "../../service/firebase";
import { useParams } from "react-router-dom";
import { AddRestaurantForm } from "../../types/Restaurant.types";
import RestaurantForm from "../../components/RestaurantForm";
import useRestaurant from "../../hooks/useRestaurant";
import { FirebaseError } from "firebase/app";
import { toast } from "react-toastify";

const EditRestaurantPage = () => {
	const { id } = useParams();
	const { data: resturant, loading } = useRestaurant(id);

	const updateResturant = async (data: AddRestaurantForm) => {
		if (!id) {
			throw new Error("No id provided");
			return;
		}
		try {
			const docRef = doc(restaurantCol, id);
			const { photoFiles, ...restData } = data;

			await updateDoc(docRef, {
				...restData,
			});
		} catch (error) {
			if (error instanceof FirebaseError) {
				toast.error(error.message);
			}
			if (error instanceof Error) {
				toast.error(error.message);
			} else {
				toast.error("Error updating resturant");
			}
		}
	};

	if (loading || !resturant) {
		return <p>Loading...</p>;
	}

	return (
		<div>
			<h3>Edit</h3>
			<RestaurantForm initialValues={resturant} onSave={updateResturant} />
		</div>
	);
};

export default EditRestaurantPage;
