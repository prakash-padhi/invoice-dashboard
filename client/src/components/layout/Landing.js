import React, { useState, Fragment } from "react";
import { Redirect } from "react-router-dom";
import { Container, Row, Col } from "reactstrap";
import logo from "../../assets/logo192.png";
import { FiLogIn } from "react-icons/fi";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { login } from "../../actions/auth";
import Alert from "./Alert";

import {
	Form,
	CustomInput,
	FormGroup,
	Label,
	Input,
	Card,
	Button,
	CardHeader,
	CardFooter,
	CardBody,
	CardTitle
} from "reactstrap";
import Spinner from "./Spinner";

const Landing = ({ login, isAuthenticated, loading }) => {
	const [formData, setFormData] = useState({
		email: "",
		password: ""
	});
	if (isAuthenticated) {
		return <Redirect to="/dashboard" />;
	}
	const { email, password } = formData;

	const onChange = e => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};
	const onSubmit = async e => {
		e.preventDefault();
		login(email, password);
	};
	return (
		<Fragment>
			<Container className="themed-container">
				<div className="login__form-wrapper">
					{!loading ? (
						<Fragment>
							<Row>
								<Col>
									<Card>
										<CardHeader className="custom_header">
											<h5 className="card_header text-center">
												INVOICELY DASHBOARD
											</h5>
										</CardHeader>
										<CardBody>
											<Alert />
											<CardTitle className="text-center">
												<h5 className="card_title">Admin Login</h5>
											</CardTitle>
											<Row className="form__wrapper">
												<Col lg="6" md="8">
													<Form id="adminLogin" onSubmit={e => onSubmit(e)}>
														<FormGroup className="mt-sm-2 mb-sm-2">
															<Label for="exampleEmail" className="mr-sm-2">
																Email
															</Label>
															<Input
																type="email"
																name="email"
																id="adminEmail"
																value={email}
																onChange={e => onChange(e)}
																bsSize="lg"
																required
															/>
														</FormGroup>
														<FormGroup className="mt-sm-2 mb-sm-2">
															<Label for="examplePassword" className="mr-sm-2">
																Password
															</Label>
															<Input
																type="password"
																name="password"
																id="adminPassword"
																value={password}
																onChange={e => onChange(e)}
																bsSize="lg"
																required
															/>
														</FormGroup>
														<FormGroup className="mt-sm-4 mb-sm-4">
															<Button
																className="login__submit"
																type="submit"
																size="lg"
																block
															>
																<FiLogIn /> LOGIN
															</Button>
														</FormGroup>
														<FormGroup className="mt-sm-2 mb-sm-2">
															<CustomInput
																type="checkbox"
																id="exampleCustomCheckbox"
																label="Remember me"
															/>
														</FormGroup>
													</Form>
												</Col>
											</Row>
										</CardBody>
										<CardFooter className="text-center custom_footer">
											<img src={logo} id="footerLogo" alt="Brand Logo" />
										</CardFooter>
									</Card>
								</Col>
							</Row>
						</Fragment>
					) : (
							<Spinner />
						)}
				</div>
			</Container>
		</Fragment>
	);
};

Landing.propTypes = {
	login: PropTypes.func.isRequired,
	isAuthenticated: PropTypes.bool,
	loading: PropTypes.bool
};

const mapStateToProps = state => ({
	login: PropTypes.func.isRequired,
	isAuthenticated: state.auth.isAuthenticated,
	loading: state.auth.loading
});

export default connect(mapStateToProps, { login })(Landing);
