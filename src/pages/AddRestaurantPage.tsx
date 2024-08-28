import { doc, setDoc } from "firebase/firestore";
import RestaurantForm from "../components/RestaurantForm";
import { restaurantCol, storage } from "../service/firebase";
import { Restaurant } from "../types/Restaurant.types";
import { FirebaseError } from "firebase/app";
import { toast } from "react-toastify";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { useState } from "react";

const AddRestaurantPage = () => {
	const addResturant = async (data: Restaurant) => {
		const photoId = uuidv4();

		if (data.photoFiles) {
			const photo = data.photoFiles[0];
			const photoFileRef = ref(storage, `restaurantsPhotos/${photoId}/${photo.name}`);
			const upLoadPhoto = uploadBytesResumable(photoFileRef, photo);

			await upLoadPhoto.then();
			const url = await getDownloadURL(photoFileRef);

			try {
				const docRef = doc(restaurantCol);
				const { photoFiles, ...restData } = data;

				const newRestaurant = await setDoc(docRef, {
					...restData,
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
					photoUrl: url,
				});

				toast.success("Submitted restaurant 🦄");
				console.log(newRestaurant);
			} catch (error) {
				console.error("Error adding restaurant", error);
				if (error instanceof FirebaseError) {
					toast.error(error.message);
				}
			}
		}
	};
	return <RestaurantForm onSave={addResturant} />;
};

export default AddRestaurantPage;
