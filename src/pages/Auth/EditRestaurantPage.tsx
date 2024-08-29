import { doc, updateDoc } from "firebase/firestore";
import { restaurantCol } from "../../service/firebase";
import { useParams } from "react-router-dom";
import { Restaurant } from "../../types/Restaurant.types";
import RestaurantForm from "../../components/RestaurantForm";
import useRestaurant from "../../hooks/useRestaurant";

const EditRestaurantPage = () => {
	const { id } = useParams();
	const { data: resturant, loading } = useRestaurant(id as string);

	const updateResturant = async (data: Restaurant) => {
		const docRef = doc(restaurantCol, id);
		const { photoFiles, ...restData } = data;

		await updateDoc(docRef, {
			...restData,
		});
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
