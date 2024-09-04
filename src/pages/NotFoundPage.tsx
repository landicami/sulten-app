import Container from "react-bootstrap/Container";
import { Link } from "react-router-dom";


const NotFoundPage = () => {
    return (
        <Container className="notfound-wrapper">
            <h2>This page does not exist</h2>
            <div className="button">
                <Link to={"/"}>&lt; Homepage</Link>
            </div>
        </Container>
    )
}

export default NotFoundPage;