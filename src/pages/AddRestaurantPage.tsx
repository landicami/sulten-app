import { doc, setDoc } from "firebase/firestore";
import RestaurantForm from "../components/RestaurantForm";
import { restaurantCol, storage } from "../service/firebase";
import { AddRestaurantForm } from "../types/Restaurant.types";
import { FirebaseError } from "firebase/app";
import { toast } from "react-toastify";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { getGeocoding } from "../service/GoogleMaps_API";

const AddRestaurantPage = () => {
	const addResturant = async (data: AddRestaurantForm) => {
		const photoUrls: string[] = [];
		const photoId = uuidv4();

		// geocode address into lat/lng
		const geocodeRes = await getGeocoding(data.address + ", " + data.city);
		if (!geocodeRes.results[0].geometry.location.lat || !geocodeRes.results[0].geometry.location.lng) {
			toast.error("This is not the address you're looking for");
			return;
		}

		if (data.photoFiles && data.photoFiles.length > 0) {
			const photos = Array.from(data.photoFiles);

			const uploadPromises = photos.map(async (photo) => {
				const photoFileRef = ref(storage, `restaurantsPhotos/${photoId}/${photo.name}`);
				const uploadPhoto = uploadBytesResumable(photoFileRef, photo);

				await uploadPhoto;
				const url = await getDownloadURL(photoFileRef);
				photoUrls.push(url);
			});

			await Promise.all(uploadPromises);
		}

		try {
			const docRef = doc(restaurantCol);
			const { photoFiles, ...restData } = data;

			await setDoc(docRef, {
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
				photoUrls: photoUrls,
			});

			toast.success("Submitted restaurant 🦄");
		} catch (error) {
			console.error("Error adding restaurant", error);
			if (error instanceof FirebaseError) {
				toast.error(error.message);
			}
		}
	};
	return <RestaurantForm onSave={addResturant} />;
};

export default AddRestaurantPage;
