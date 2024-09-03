import {
	onAuthStateChanged,
	sendPasswordResetEmail,
	signInWithEmailAndPassword,
	signOut,
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
	updateInfo: () => boolean;
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

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (admin) => {
			setCurrentAdmin(admin);
			setLoading(false);
		});

		return unsubscribe;
	}, []);

	return (
		<AuthContext.Provider
			value={{
				currentAdmin,
				login,
				logout,
				resetPassword,
				userEmail,
				userName,
				userPhoto,
				updateInfo,
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
