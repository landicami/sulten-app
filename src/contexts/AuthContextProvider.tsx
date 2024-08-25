import { onAuthStateChanged, signInWithEmailAndPassword, signOut, User, UserCredential } from "firebase/auth";
import { createContext, PropsWithChildren, useEffect, useState } from "react";
import { auth } from "../service/firebase";


interface IAuthContext {
    currentAdmin: User | null;
    login: (email: string, password: string) => Promise<UserCredential>;
    logout: () => Promise<void>;
}

export const AuthContext = createContext<IAuthContext | null>(null);

const AuthContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
    const [currentAdmin, setCurrentAdmin] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const login = (email: string, password: string) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    const logout = () => {
        return signOut(auth);
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (admin) => {
            setCurrentAdmin(admin);
        });

        setLoading(false);

        return unsubscribe;
    }, []);

    return (
        <AuthContext.Provider value={{
            currentAdmin,
            login,
            logout
        }}> {loading
            ? <div><p>Loading...</p></div>
            : <>{children}</>
            }
        </AuthContext.Provider>
    )

}



export default AuthContextProvider;