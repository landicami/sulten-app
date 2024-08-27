import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { Link, NavLink } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const Navigation = () => {
	const { currentAdmin } = useAuth();

	return (
		<Navbar bg="dark" variant="dark" expand="md">
			<Container>
				<Navbar.Brand as={Link} to="/">
					😡 SULTEN.nu
				</Navbar.Brand>

				<Navbar.Toggle aria-controls="basic-navbar-nav" />
				<Navbar.Collapse id="basic-navbar-nav">
					<Nav className="ms-auto">
						<Nav.Link as={NavLink} end to="/">
							Map
						</Nav.Link>
						<Nav.Link as={NavLink} end to="/list-all-restaurants">
							List
						</Nav.Link>
						<Nav.Link as={NavLink} end to="/add-restaurant">
							Add recommendation
						</Nav.Link>
						{currentAdmin ? (
							<Nav.Link as={NavLink} end to="logout">
								Log out!
							</Nav.Link>
						) : (
							<Nav.Link as={NavLink} end to="/login">
								Log in as Admin
							</Nav.Link>
						)}

						{/* Only if Admin is logged in */}
						{currentAdmin && (
							<Nav.Link as={NavLink} end to="/admin-restaurants">
								Restaurants - Admin
							</Nav.Link>
						)}
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
};

export default Navigation;
