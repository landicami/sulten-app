import { doc, setDoc } from "firebase/firestore";
import RestaurantForm from "../components/RestaurantForm";
import { restaurantCol } from "../service/firebase";
import { Restaurant } from "../types/Restaurant.types";
import { FirebaseError } from "firebase/app";
import { toast } from "react-toastify";

const AddRestaurantPage = () => {

    const addResturant = async (data: Restaurant) => {
        try {
            const docRef = doc(restaurantCol);

            await setDoc(docRef, {
                ...data,
                name: data.name.trim(),
                approvedByAdmin: data.approvedByAdmin ?? false,
                address: data.address.trim(),
                city: data.city.trim(),
                description: data.description,
                category: data.category,
                offer: data.offer,
                email: data.email,
                phone: data.phone,
                website: data.website,
                facebook: data.facebook,
                instagram: data.instagram,
            });

            toast.success("Submitted restaurant 🦄");

        } catch (error) {
            console.error("Error adding restaurant", error);
            if (error instanceof FirebaseError) {
                toast.error(error.message);
            }
        }

        console.log(data);
    }
    return <RestaurantForm onSave={addResturant} />;
};

export default AddRestaurantPage;
