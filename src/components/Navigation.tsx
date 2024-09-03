import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { Link, NavLink } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Image from "react-bootstrap/Image";
import NavDropdown from "react-bootstrap/NavDropdown";

const Navigation = () => {
	const { currentAdmin, userEmail, userName, userPhoto } = useAuth();

	return (
		<Navbar bg="dark" variant="dark" expand="md">
			<Container>
				<Navbar.Brand as={Link} to="/">
					😡 SULTEN.nu
				</Navbar.Brand>

				<Navbar.Toggle aria-controls="basic-navbar-nav" />
				<Navbar.Collapse id="basic-navbar-nav">
					<Nav className="ms-auto">
						{/* If admin is logged in */}
						{currentAdmin ? (
							<>
								<NavDropdown
									title={
										userPhoto ? (
											<Image src={userPhoto} fluid height={30} width={30} roundedCircle />
										) : (
											(userName || userEmail) ?? "Admin"
										)
									}
								>
									<NavDropdown.Item as={NavLink} to="/update-profile">
										Update profile
									</NavDropdown.Item>
									<NavDropdown.Divider />
									<NavDropdown.Item as={NavLink} end to="/admin-restaurants">
										Restaurants - Admin
									</NavDropdown.Item>
									<NavDropdown.Divider />
									<NavDropdown.Item as={NavLink} end to="/logout">
										Log out!
									</NavDropdown.Item>
								</NavDropdown>
							</>
						) : (
							/* If admin isn't logged in */
							<Nav.Link as={NavLink} end to="/login">
								Log in as Admin
							</Nav.Link>
						)}
						<Nav.Link as={NavLink} end to="/">
							Map
						</Nav.Link>
						<Nav.Link as={NavLink} end to="/list-all-restaurants">
							List
						</Nav.Link>
						<Nav.Link as={NavLink} end to="/add-restaurant">
							Add recommendation
						</Nav.Link>
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
};

export default Navigation;
