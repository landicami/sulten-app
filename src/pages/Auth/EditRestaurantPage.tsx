import { doc, updateDoc } from "firebase/firestore";
import { restaurantCol } from "../../service/firebase";
import { useParams } from "react-router-dom";
import { Restaurant } from "../../types/Restaurant.types";
import RestaurantForm from "../../components/RestaurantForm";
import useRestaurant from "../../hooks/useRestaurant";

const EditRestaurantPage = () => {
    const { id } = useParams();
    const { data: resturant, loading } = useRestaurant(id);

    const updateResturant = async (data: Restaurant) => {

        if (!id) {
            throw new Error("No id provided");
            return;
        }
        try {
            const docRef = doc(restaurantCol, id);

		await updateDoc(docRef, {
			...restData,
		});
	};

    if (loading || !resturant) {
        return <p>Loading...</p>
    }

    return (
        <div>
            <h3>Edit</h3>
            <RestaurantForm initialValues={resturant} onSave={updateResturant} />
        </div>
    )
}

export default EditRestaurantPage;
