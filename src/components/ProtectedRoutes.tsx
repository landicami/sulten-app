import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useEffect } from "react";

interface ProtectedRoutesProps {
	redirect?: string
}

const ProtectedRoutes: React.FC<ProtectedRoutesProps> = ({ redirect = "/login" }) => {
	const { currentAdmin } = useAuth();

	useEffect(() => {
		if (currentAdmin) {
			return;
		}
		throw new Error("You must be logged in to access this page!");
	}, [currentAdmin]);

	return (
		currentAdmin
			? <Outlet />
			: <Navigate to={redirect} />
	)
}

export default ProtectedRoutes;
