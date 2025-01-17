import useAdminRestaurants from "../../hooks/useAdminRestaurants";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { ColumnDef } from "@tanstack/react-table";
import { Restaurant } from "../../types/Restaurant.types";
import TanstackTable from "../../components/table/TanstackTable";
import useTipsRestaurants from "../../hooks/useTipsRestaurants";
import { Admin } from "../../types/Admin.types";
import useAdmins from "../../hooks/useAdmins";
import DeleteRestaurantHandler from "../../components/DeleteRestaurantHandler";

const AdminRestaurantPage = () => {
	const { currentAdmin } = useAuth();
	const { data: adminRestaurants, loading: adminLoading } = useAdminRestaurants();
	const { data: tipsRestaurants, loading: tipLoading } = useTipsRestaurants();
	const { data: admins, loading: adminsLoading } = useAdmins();

	if (!currentAdmin) {
		<p>You need to be logged in as admin to see this page</p>;
	}

	const adminColumnDefs: ColumnDef<Admin>[] = [
		{
			accessorKey: "name",
			header: "Name",
		},
		{
			accessorKey: "email",
			header: "Email",
		},
		{
			accessorKey: "photoUrl",
			header: "Photo",
			cell: ({ getValue }) => (
				<img
					src={(getValue() as string) || "https://placehold.co/50x50?text=no+pic"}
					alt="Admin Photo"
					className="admin-photo-in-table"
				/>
			),
		},
	];

	const restaurantColumnDefs: ColumnDef<Restaurant>[] = [
		{
			accessorKey: "name",
			header: "Name",
		},
		{
			accessorKey: "address",
			header: "Address",
		},
		{
			accessorKey: "city",
			header: "City",
		},
		{
			accessorKey: "approvedByAdmin",
			header: "Is this approved",
		},
		{
			accessorKey: "location.lat",
			header: "Lat",
		},
		{
			accessorKey: "location.lng",
			header: "Lng",
		},
		{
			header: "Edit",
			cell: ({ row }) => (
				<Link to={`/restaurants/${row.original._id}`}>
					<Button size="sm" className="btn btn-warning">
						Edit
					</Button>
				</Link>
			),
		},
		{
			header: "Delete",
			cell: ({ row }) => <DeleteRestaurantHandler row={row} />,
		},
	];

	return (
		<div>
			{adminLoading && tipLoading && adminsLoading && <p>Loading...</p>}
			<h1 className="mb-3">Admin</h1>

			<hr />
			<h2 className="mb-3 text-center">Restaurants</h2>

			{adminRestaurants && adminRestaurants.length > 0 && (
				<>
					<h2 className="mb-3">Admin checked</h2>
					<TanstackTable columns={restaurantColumnDefs} data={adminRestaurants} />
				</>
			)}

			<hr />

			{tipsRestaurants && tipsRestaurants.length > 0 && (
				<>
					<h2 className="mb-3">Tips from tippers</h2>
					<TanstackTable columns={restaurantColumnDefs} data={tipsRestaurants} />
				</>
			)}

			<hr />

			<h2 className="mb-3">Admins - overwiev </h2>

			{admins && admins.length > 0 && (
				<>
					<h2 className="mb-3">All Admins </h2>
					<TanstackTable columns={adminColumnDefs} data={admins} />
				</>
			)}
		</div>
	);
};

export default AdminRestaurantPage;
