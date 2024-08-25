import { Navigate } from "react-router-dom";
import { PropsWithChildren } from "react";
import useAuth from "../hooks/useAuth";

const ProtectedRoutes: React.FC<PropsWithChildren> = ({ children }) => {
	const { currentAdmin } = useAuth();
	if (!currentAdmin) {
		return <Navigate to="/login" />;
	} else {
		return children;
	}
};

export default ProtectedRoutes;
