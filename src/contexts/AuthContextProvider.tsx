import {
	createUserWithEmailAndPassword,
	onAuthStateChanged,
	sendPasswordResetEmail,
	signInWithEmailAndPassword,
	signOut,
	updateEmail,
	updatePassword,
	updateProfile,
	User,
	UserCredential,
} from "firebase/auth";
import { createContext, PropsWithChildren, useEffect, useState } from "react";
import { auth } from "../service/firebase";

interface IAuthContext {
	currentAdmin: User | null;
	login: (email: string, password: string) => Promise<UserCredential>;
	logout: () => Promise<void>;
	resetPassword: (email: string) => Promise<void>;
	userEmail: string | null;
	userName: string | null;
	userPhoto: string | null;
	setEmail: (email: string) => Promise<void>;
	setName: (name: string) => Promise<void>;
	setPhoto: (url: string) => Promise<void>;
	setPassword: (password: string) => Promise<void>;
	updateInfo: () => boolean;
	signup: (email: string, password: string) => Promise<UserCredential>;
}

export const AuthContext = createContext<IAuthContext | null>(null);

const AuthContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
	const [currentAdmin, setCurrentAdmin] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const [userName, setUserName] = useState<string | null>(null);
	const [userEmail, setUserEmail] = useState<string | null>(null);
	const [userPhoto, setUserPhoto] = useState<string | null>(null);

	const login = (email: string, password: string) => {
		return signInWithEmailAndPassword(auth, email, password);
	};

	const logout = () => {
		return signOut(auth);
	};

	const resetPassword = (email: string) => {
		return sendPasswordResetEmail(auth, email, {
			url: `${window.location.origin}/login`,
		});
	};

	const updateInfo = () => {
		if (!currentAdmin) {
			return false;
		}

		setUserName(currentAdmin.displayName);
		setUserEmail(currentAdmin.email);
		setUserPhoto(currentAdmin.photoURL);

		return true;
	};

	const setName = async (name: string) => {
		if (!currentAdmin) {
			throw new Error("No current admin");
		}

		return updateProfile(currentAdmin, { displayName: name });
	};

	const setEmail = async (email: string) => {
		if (!currentAdmin) {
			throw new Error("No current admin");
		}

		return updateEmail(currentAdmin, email);
	};

	const setPhoto = async (url: string) => {
		if (!currentAdmin) {
			throw new Error("No current admin");
		}

		return updateProfile(currentAdmin, { photoURL: url });
	};

	const setPassword = async (password: string) => {
		if (!currentAdmin) {
			throw new Error("No current admin");
		}

		return updatePassword(currentAdmin, password);
	};

	const signup = (email: string, password: string) => {
		return createUserWithEmailAndPassword(auth, email, password);
	};

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (admin) => {
			setCurrentAdmin(admin);
			setLoading(false);
		});

		if (currentAdmin) {
			updateInfo();
		}

		return unsubscribe;
	}, []);

	return (
		<AuthContext.Provider
			value={{
				currentAdmin,
				login,
				logout,
				updateInfo,
				resetPassword,
				setName,
				setEmail,
				setPassword,
				setPhoto,
				signup,
				userEmail,
				userName,
				userPhoto,
			}}
		>
			{loading ? (
				<div>
					<p>Loading...</p>
				</div>
			) : (
				<>{children}</>
			)}
		</AuthContext.Provider>
	);
};

export default AuthContextProvider;
