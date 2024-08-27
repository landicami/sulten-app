import useAdminRestaurants from "../../hooks/useAdminRestaurants";
import ListGroup from "react-bootstrap/ListGroup";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const AdminRestaurantPage = () => {
	const { currentAdmin } = useAuth();
	const { data: adminRestaurants, loading } = useAdminRestaurants();
	console.log("Data", adminRestaurants);

	if (!currentAdmin) {
		<p>You need to be logged in as admin to see this page</p>;
	}
	return (
		<div>
			{loading && <p>Loading...</p>}

			{adminRestaurants && adminRestaurants?.length > 0 && (
				<ListGroup>
					{adminRestaurants.map((adminRestaurant) => (
						<ListGroup.Item key={adminRestaurant._id}>
							<p>{adminRestaurant.name}</p>
							<span>
								{adminRestaurant.approvedByAdmin === false
									? "This has to be approved by admin"
									: "Approved"}
							</span>
							<br />
							<Link to={`/restaurants/${adminRestaurant._id}`}>Edit me</Link>
						</ListGroup.Item>
					))}
				</ListGroup>
			)}
		</div>
	);
};

export default AdminRestaurantPage;
