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
			<h1 className="mb-3">Restaurants</h1>

			{adminRestaurants && adminRestaurants.length > 0 && (
				<>
					<h2 className="mb-3">Admin checked</h2>
					<TanstackTable columns={restaurantColumnDefs} data={adminRestaurants} />
				</>
			)}

			{tipsRestaurants && tipsRestaurants.length > 0 && (
				<>
					<h2 className="mb-3">Tips from tippers</h2>
					<TanstackTable columns={restaurantColumnDefs} data={tipsRestaurants} />
				</>
			)}

			{admins && admins.length > 0 && (
				<>
					<h2 className="mb-3">Admins </h2>
					<TanstackTable columns={adminColumnDefs} data={admins} />
				</>
			)}
		</div>
	);
};

export default AdminRestaurantPage;
