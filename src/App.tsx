import Navigation from "./components/Navigation";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import MapPage from "./pages/MapPage";
import NotFoundPage from "./pages/NotFoundPage";
import EditRestaurantPage from "./pages/Auth/EditRestaurantPage";
import AdminRestaurantPage from "./pages/Auth/AdminRestaurantPage";
import LoginPage from "./pages/Auth/LoginPage";
import ForgotPasswordPage from "./pages/Auth/ForgotPasswordPage";
import AddRestaurantPage from "./pages/AddRestaurantPage";
import ProtectedRoutes from "./components/ProtectedRoutes";
import ListAllRestaurantsPage from "./pages/ListAllRestaurantPage";
import "./assets/scss/App.scss";
import SignupPage from "./pages/SignupPage";
import UpdateProfilePage from "./pages/Auth/UpdateProfilePage";
import AboutUsPage from "./pages/AboutUsPage";
import Container from "react-bootstrap/Container";
import LogOutPage from "./pages/Auth/LogOutPage";

function App() {
	return (
		<Container id="App">
			<Navigation />

			<Routes>
				<Route path="*" element={<NotFoundPage />} />
				<Route path="/" element={<MapPage />} />
				<Route path="/add-restaurant" element={<AddRestaurantPage />} />
				<Route path="/list-all-restaurants" element={<ListAllRestaurantsPage />} />
				<Route path="/about-us" element={<AboutUsPage />} />

				{/* Protected Routes */}
				<Route element={<ProtectedRoutes />}>
					<Route path="/admin-restaurant" element={<AdminRestaurantPage />} />
					<Route path="/restaurants/:id" element={<EditRestaurantPage />} />
					<Route path="/update-profile" element={<UpdateProfilePage />} />
				</Route>

				{/* Auth Routes */}
				<Route path="/login" element={<LoginPage />} />
				<Route path="/logout" element={<LogOutPage />} />

				<Route path="/forgot-password" element={<ForgotPasswordPage />} />
				<Route path="/signup" element={<SignupPage />} />
			</Routes>

			<ToastContainer position="top-right" autoClose={3000} closeOnClick pauseOnHover theme="light" />
		</Container>
	);
}

export default App;
