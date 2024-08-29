import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card"
import useAdminRestaurants from "../hooks/useAdminRestaurants";
import Button from "react-bootstrap/Button";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ResturantCard = () => {
    const { data: resturants, loading } = useAdminRestaurants();
    const navigate = useNavigate();

    if (!resturants) {
        toast.error("There is no resturants");
        navigate("/");
        return;
    }

    return (
        <Container>
            {loading && <p>Loading...</p>}
            {resturants.map((resturant) => (
                <Card key={resturant._id}>
                    <Card.Img variant="top" src="https://placehold.co/600x400" />
                    <Card.Body>
                        <Card.Title>{resturant.name}</Card.Title>
                        <Card.Text>
                            {resturant.description}
                        </Card.Text>
                        <Card.Text>
                            {resturant.category}
                        </Card.Text>
                        <Card.Text>
                            {resturant.offer}
                        </Card.Text>
                    </Card.Body>
                    <Card.Footer>
                        {resturant.website ? (
                            <Button><a href={resturant.website}></a>Besök hemsidan</Button>
                        ) : (<p>Det finns ingen hemsida</p>
                        )}
                    </Card.Footer>
                </Card>
            ))}
        </Container>
    )
}

export default ResturantCard;