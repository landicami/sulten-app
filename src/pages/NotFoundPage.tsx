import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";
import { Link, useNavigate } from "react-router-dom";

const NotFoundPage = () => {
	const navigate = useNavigate();
	const handleClick = () => {
		navigate("/");
	};
	return (
		<Container className="notfound-wrapper">
			<Image
				fluid
				src={
					"https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExbXlrMjkyeTlpM3lzbzY2Nm1wNTNjcHdpZDBsM3M0ZW40OGZ5dW1jcCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/C21GGDOpKT6Z4VuXyn/giphy.webp"
				}
			></Image>
			<h2>This page does not exist</h2>
			<Button onClick={handleClick}>Take me home, country roads!</Button>
		</Container>
	);
};

export default NotFoundPage;
