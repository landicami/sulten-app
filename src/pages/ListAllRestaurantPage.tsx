import useAdminRestaurants from "../hooks/useAdminRestaurants";
import { ColumnDef } from "@tanstack/react-table";
import { Restaurant } from "../types/Restaurant.types";
import Container from "react-bootstrap/Container";
import TanstackTable from "../components/table/TanstackTable";
import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";


const ListAllRestaurantsPage = () => {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const { data: adminRestaurants, loading: adminLoading } = useAdminRestaurants();

    const updateMedia = () => {
        setIsMobile(window.innerWidth < 768);
    };

    useEffect(() => {
        window.addEventListener("resize", updateMedia);
        return () => window.removeEventListener("resize", updateMedia);
    }, []);

    const columnDefs: ColumnDef<Restaurant>[] = [
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
            accessorKey: "description",
            header: "Description",
        },
        {
            accessorKey: "category",
            header: "Category",
        },
        {
            accessorKey: "offer",
            header: "Offer",
        },
        {
            accessorKey: "website",
            header: "Website",
        },
        {
            accessorKey: "phone",
            header: "Phone",
        },
        {
            accessorKey: "email",
            header: "Email",
        },
    ]

    return (
        <Container fluid>
            {adminLoading && <p>Loading...</p>}

            <h2 className="mb-4">List of all restaurants 🥙</h2>

            {adminRestaurants && adminRestaurants.length > 0 ? (
                isMobile ? (
                    <Row>
                        {adminRestaurants.map((restaurant) => (
                            <Col xs={12} key={restaurant._id} className="mb-3">
                                <div className="p-3 border border-secondary rounded">
                                    <h5>{restaurant.name}</h5>
                                    <p><strong>Address:</strong> {restaurant.address}</p>
                                    <p><strong>City:</strong> {restaurant.city}</p>
                                    {restaurant.description && (
                                        <p><strong>Description:</strong> {restaurant.description}</p>
                                    )}
                                    {restaurant.category && (
                                        <p><strong>Category:</strong> {restaurant.category}</p>
                                    )}
                                    {restaurant.offer && (
                                        <p><strong>Offer:</strong> {restaurant.offer}</p>
                                    )}
                                    {restaurant.website && (
                                        <p><strong>Website:</strong><a href={restaurant.website} target="_blank">{restaurant.website}</a></p>
                                    )}
                                </div>
                            </Col>
                        ))}
                    </Row>
                ) : (
                    <TanstackTable columns={columnDefs} data={adminRestaurants} />
                )
            ) : (
                <p>No restaurants it the list...</p>
            )}
        </Container>
    )
}

export default ListAllRestaurantsPage;