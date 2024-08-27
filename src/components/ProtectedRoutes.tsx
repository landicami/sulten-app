import { Navigate, Outlet, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useEffect } from "react";
import { toast } from "react-toastify";

interface ProtectedRoutesProps {
	redirect?: string;
}

const ProtectedRoutes: React.FC<ProtectedRoutesProps> = ({ redirect = "/login" }) => {
	const { currentAdmin } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		if (!currentAdmin) {
			toast.warning("You need to be logged in");
			navigate(redirect);
		}
	}, [currentAdmin, navigate, redirect]);

	return currentAdmin ? <Outlet /> : <Navigate to={redirect} />;
};

export default ProtectedRoutes;