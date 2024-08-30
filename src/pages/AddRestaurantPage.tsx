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

		let latLng = {};

		// geocode address into lat/lng
		try {
			const geoCodeRes = await getGeocoding(data.address + ", " + data.city);

			if (geoCodeRes.status === "ZERO_RESULTS") {
				toast.error("This is not the address you are looking for ❌");
				return;
			}

			latLng = {
				lat: geoCodeRes.results[0].geometry.location.lat,
				lng: geoCodeRes.results[0].geometry.location.lng,
			};
		} catch (err) {
			if (err instanceof Error) {
				console.log(err.message, "❌");
				toast.error("This is not the address you are looking for ❌");
			} else {
				console.log("❌ error...");
				toast.error("This is not the address you are looking for ❌");
			}
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
				location: latLng,
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
