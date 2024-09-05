import { doc, getDoc, updateDoc } from "firebase/firestore";
import { restaurantCol, storage } from "../../service/firebase";
import { useParams } from "react-router-dom";
import { AddRestaurantForm } from "../../types/Restaurant.types";
import RestaurantForm from "../../components/RestaurantForm";
import useRestaurant from "../../hooks/useRestaurant";
import { FirebaseError } from "firebase/app";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { getGeocoding } from "../../service/GoogleMaps_API";

const EditRestaurantPage = () => {
	const { id } = useParams();
	const { data: resturant, loading } = useRestaurant(id);

	const updateResturant = async (data: AddRestaurantForm) => {
		if (!id) {
			throw new Error("No id provided");
		}
		try {
			const docRef = doc(restaurantCol, id);
			const existingDoc = await getDoc(docRef);
			const existingPhotoUrls: string[] = existingDoc.data()?.photoUrls || [];

			const newPhotoUrls: string[] = [];
			const photoId = uuidv4();

			if (data.photoFiles && data.photoFiles.length > 0) {
				const photos = Array.from(data.photoFiles);

				const uploadPromises = photos.map(async (photo) => {
					const photoFileRef = ref(storage, `restaurantsPhotos/${photoId}/${photo.name}`);
					const uploadPhoto = uploadBytesResumable(photoFileRef, photo);

					await uploadPhoto;
					const url = await getDownloadURL(photoFileRef);
					newPhotoUrls.push(url);
				});

				await Promise.all(uploadPromises);
			}

			const updatedPhotoUrls = [...existingPhotoUrls, ...newPhotoUrls];

			let latLng = {};
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
					toast.error("This is not the address you are looking for ❌");
				} else {
					toast.error("This is not the address you are looking for ❌");
				}
			}

			// eslint-disable-next-line
			const { photoFiles, ...restData } = data;

			await updateDoc(docRef, {
				...restData,
				photoUrls: updatedPhotoUrls,
				location: latLng,
			});
			toast.success("Updated!");
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
