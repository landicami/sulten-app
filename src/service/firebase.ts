import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, DocumentData, collection, CollectionReference } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { Restaurant } from "../types/Restaurant.types";
import { Admin, CreateAdmin } from "../types/Admin.types";

const firebaseConfig = {
	apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
	authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
	projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
	storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
	appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);

export const storage = getStorage(app);

const createCollection = <T = DocumentData>(collectionName: string) => {
	return collection(db, collectionName) as CollectionReference<T>;
};

export const restaurantCol = createCollection<Restaurant>("restaurants");
export const adminCol = createCollection<Admin>("admins");
export const sigupAdminCol = createCollection<CreateAdmin>("admins");

export default app;
