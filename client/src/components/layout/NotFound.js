import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { Container, Jumbotron, Button } from "reactstrap";

const NotFound = () => {
	return (
		<Fragment>
			<Container className="themed-container">
				<div className="notFound__wrapper">
					<Jumbotron>
						<h3>AWWW...DON’T CRY.</h3>
						<p className="lead">It's just a 404 Error!</p>
						<hr className="my-2" />
						<p>
							What you’re looking for may have been misplaced in Long Term
							Memory.
						</p>
						<p className="lead">
							<Button color="dark">
								<Link to="/">BACK TO HOMEPAGE</Link>
							</Button>
						</p>
					</Jumbotron>
				</div>
			</Container>
		</Fragment>
	);
};

export default NotFound;
