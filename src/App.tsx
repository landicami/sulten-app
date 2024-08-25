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


function App() {
	return (
		<div id="App">

			<Navigation />

			<Routes>
				<Route path="*" element={<NotFoundPage />} />
				<Route path="/" element={<MapPage />} />
				<Route path="/add-restaurant" element={<AddRestaurantPage />} />
				<Route path="/list-all-restaurants" element={<ListAllRestaurantsPage />} />

				{/* Protected Routes */}
				<Route element={<ProtectedRoutes />}>
					<Route path="/admin-restaurant" element={<AdminRestaurantPage />} />
					<Route path="/edit-restaurant" element={<EditRestaurantPage />} />
				</Route>

				{/* Auth Routes */}
				<Route path="/login" element={<LoginPage />} />
				<Route path="/forgot-password" element={<ForgotPasswordPage />} />
			</Routes>

			<ToastContainer
				position="top-right"
				autoClose={3000}
				closeOnClick
				pauseOnHover
				theme="light"
			/>
		</div>
	)
}

export default App;
