import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

const AboutUsPage = () => {
	return (
		<Container className="p-3">
			<Row className="justify-content-center">
				<Col lg={8} md={10} sm={12}>
					<h1>Hi! Welcome to our Hangry Application</h1>
					<hr />
					<p>
						We are a team of students from Medieinstitutet Malmö, class of Front end developers, who have
						developed this application using a variety of modern technologies and tools. Our project
						incorporates:
					</p>
					<ul>
						<li>React with routing, forms, tables, and Bootstrap for responsive design</li>
						<li>TypeScript for type safety and robust development practices</li>
						<li>Firebase for Authentication, Cloud Firestore, and Storage</li>
						<li>
							Additional libraries such as React Spinners for loading states, Toastify for notifications,
							and Axios for HTTP requests
						</li>
						<li>Sass for advanced styling and design customization</li>
					</ul>
					<hr />
					<p>Check out our GitHub profiles:</p>
					<ul>
						<li>
							<a href="https://github.com/Ann1gma" target="_blank" rel="noopener noreferrer">
								Ann
							</a>
						</li>
						<li>
							<a href="https://github.com/landicami" target="_blank" rel="noopener noreferrer">
								Camilla
							</a>
						</li>
						<li>
							<a href="https://github.com/LinneaSandberg" target="_blank" rel="noopener noreferrer">
								Linnea
							</a>
						</li>
					</ul>
				</Col>
			</Row>
		</Container>
	);
};

export default AboutUsPage;
