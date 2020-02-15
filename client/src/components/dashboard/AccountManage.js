import React, { useState, Fragment } from "react";
import {
	Container,
	Button,
	Form,
	FormGroup,
	Label,
	Input,
	InputGroupAddon,
	InputGroup,
	InputGroupText,
	ListGroup,
	ListGroupItem,
	Alert
} from "reactstrap";
import PropTypes from "prop-types";
import { addAdminSubmit } from "../../actions/auth";
import { updateProfile } from "../../actions/auth";
import { connect } from "react-redux";
import Spinner from "../layout/Spinner";
import { FiUserPlus } from "react-icons/fi";
import { MdArrowBack } from "react-icons/md";
import { MdVpnKey } from "react-icons/md";
import AddAdminLogo from "../../assets/add.svg";
import CustomAlert from "../layout/Alert";

const AccountManage = ({
	auth: { isAuthenticated, loading, user },
	addAdminSubmit,
	updateProfile
}) => {
	const [noDataModifiedError, setNoDataModifiedError] = useState(false);
	const [error, setError] = useState(false);
	const [formEdit, setFormEdit] = useState(false);
	const [addAdmin, setAddAdmin] = useState(false);
	const [adminData, setAdminData] = useState({
		adminName: "",
		adminEmail: "",
		adminPhone: "",
		adminPwd: "",
		adminCnfPwd: ""
	});
	const [formData, setFormData] = useState({
		userName: "",
		userEmail: "",
		userPhone: ""
	});
	const {
		adminName,
		adminEmail,
		adminPhone,
		adminPwd,
		adminCnfPwd
	} = adminData;
	const { userName, userEmail, userPhone } = formData;
	const onEdit = e => {
		setFormEdit(true);
		setFormData({
			...formData,
			userName: user.name,
			userEmail: user.email,
			userPhone: user.mobile
		});
	};
	const onDismiss = () => {
		setNoDataModifiedError(false);
	};
	const onSubmit = e => {
		e.preventDefault();
		if (
			user.name !== userName ||
			user.email !== userEmail ||
			user.mobile !== userPhone
		) {
			updateProfile(user._id, userName, userEmail, userPhone).then(res => {
				if (res) {
					setFormEdit(false);
					setFormData({
						userName: "",
						userEmail: "",
						userPhone: ""
					});
					setNoDataModifiedError(false);
				}
			});
		} else {
			e.target.userName.focus();
			setNoDataModifiedError(true);
		}
	};
	const onAddAdmin = e => {
		e.preventDefault();
		if (adminPwd === adminCnfPwd) {
			addAdminSubmit(adminName, adminEmail, adminPhone, adminPwd).then(res => {
				if (res) {
					setAddAdmin(false);
					setAdminData({
						adminName: "",
						adminEmail: "",
						adminPhone: "",
						adminPwd: "",
						adminCnfPwd: ""
					});
				}
			});
		} else {
			e.target.adminCnfPwd.focus();
			setError(true);
		}
	};
	const fileChangedHandler = event => {
		const file = event.target.files[0];
		console.log(file);
	};
	const onFormEdit = e => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};
	const onAdminFormEdit = e => {
		setAdminData({ ...adminData, [e.target.name]: e.target.value });
		if (e.target.name === "adminPwd" || e.target.name === "adminCnfPwd") {
			setError(false);
		}
	};
	const updateProfileBack = () => {
		setFormEdit(false);
		setNoDataModifiedError(false);
	};
	const addAdminBack = () => {
		setAddAdmin(false);
		setAdminData({
			adminName: "",
			adminEmail: "",
			adminPhone: "",
			adminPwd: "",
			adminCnfPwd: ""
		});
		setError(false);
	};
	const checkUser = data => {
		if (data !== null) {
			return true;
		}
	};
	return (
		<Fragment>
			<Container className="themed-container">
				<div className="accountData__wrapper">
					<div className="width__separtor m-auto">
						<CustomAlert />
						{noDataModifiedError ? (
							<Alert
								color="danger"
								isOpen={noDataModifiedError}
								toggle={onDismiss}
							>
								No data modified
							</Alert>
						) : null}
						{!loading ? (
							<Fragment>
								{isAuthenticated ? (
									<Fragment>
										{checkUser(user) ? (
											<Fragment>
												{!addAdmin ? (
													<Fragment>
														{!formEdit ? (
															<Fragment>
																<div className="account__landing text-center m-auto">
																	<div className="overlay__wrapper rounded-circle">
																		<img
																			src={user.avatar}
																			className="account__image--logo rounded-circle"
																			alt="Profile Logo"
																		/>
																	</div>
																	<p className="user__data--values user__name pt-3">
																		{user.name}
																	</p>
																	<p className="user__data--values user__email">
																		{user.email}
																	</p>
																	<p className="user__data--values user__mobile">
																		{user.mobile}
																	</p>
																	<Button
																		onClick={e => onEdit(e)}
																		color="secondary"
																		size="lg"
																		block
																	>
																		Edit Profile
																	</Button>
																	<div className="user__action--landing mt-4">
																		<ListGroup>
																			<ListGroupItem tag="button" action>
																				<MdVpnKey /> Change Password
																			</ListGroupItem>
																			<ListGroupItem
																				tag="button"
																				action
																				onClick={e => setAddAdmin(true)}
																			>
																				<FiUserPlus /> Add Admin
																			</ListGroupItem>
																		</ListGroup>
																	</div>
																</div>
															</Fragment>
														) : (
																<Fragment>
																	<Form
																		className="account__update--form m-auto"
																		onSubmit={e => onSubmit(e)}
																	>
																		<div className="text-center">
																			<div className="overlay__wrapper rounded-circle">
																				<img
																					src={user.avatar}
																					className="account__image--logo rounded-circle"
																					alt="Profile Logo"
																				/>
																			</div>
																		</div>
																		<FormGroup className="mb-2">
																			<Label for="userName">Name</Label>
																			<Input
																				type="text"
																				name="userName"
																				id="userName"
																				onChange={e => onFormEdit(e)}
																				value={userName}
																				required
																			/>
																		</FormGroup>
																		<FormGroup className="mb-2">
																			<Label for="userEmail">Email</Label>
																			<Input
																				type="email"
																				name="userEmail"
																				id="userEmail"
																				onChange={e => onFormEdit(e)}
																				value={userEmail}
																				required
																			/>
																		</FormGroup>
																		<FormGroup className="mb-2">
																			<Label for="userPhone">Mobile</Label>
																			<InputGroup>
																				<InputGroupAddon addonType="prepend">
																					<InputGroupText>+91</InputGroupText>
																				</InputGroupAddon>
																				<Input
																					type="tel"
																					name="userPhone"
																					id="userPhone"
																					onChange={e => onFormEdit(e)}
																					value={userPhone}
																					required
																				/>
																			</InputGroup>
																		</FormGroup>
																		<div className="submit__form mt-3">
																			<Button
																				type="submit"
																				color="success"
																				size="lg"
																				block
																			>
																				Update
																		</Button>
																		</div>
																	</Form>
																	<div className="user__action--wrapper mt-3 text-center">
																		<ListGroup>
																			<ListGroupItem
																				tag="button"
																				action
																				onClick={e => updateProfileBack()}
																			>
																				<MdArrowBack /> Go Back
																		</ListGroupItem>
																		</ListGroup>
																	</div>
																</Fragment>
															)}
													</Fragment>
												) : (
														<Fragment>
															<Form
																className="add__admin--form m-auto"
																onSubmit={e => onAddAdmin(e)}
															>
																<div className="add__adminLogo--wrapper mb-2 text-center">
																	<img
																		src={AddAdminLogo}
																		alt="Add Admin Logo"
																		className="addAdmin__logo"
																	/>
																</div>
																<FormGroup className="mb-2">
																	<Label for="adminName">Name</Label>
																	<Input
																		type="text"
																		name="adminName"
																		id="adminName"
																		onChange={e => onAdminFormEdit(e)}
																		value={adminName}
																		required
																	/>
																</FormGroup>
																<FormGroup className="mb-2">
																	<Label for="adminEmail">Email</Label>
																	<Input
																		type="email"
																		name="adminEmail"
																		id="adminEmail"
																		onChange={e => onAdminFormEdit(e)}
																		value={adminEmail}
																		required
																	/>
																</FormGroup>
																<FormGroup className="mb-2">
																	<Label for="adminPhone">Mobile</Label>
																	<InputGroup>
																		<InputGroupAddon addonType="prepend">
																			<InputGroupText>+91</InputGroupText>
																		</InputGroupAddon>
																		<Input
																			type="tel"
																			name="adminPhone"
																			id="adminPhone"
																			onChange={e => onAdminFormEdit(e)}
																			value={adminPhone}
																			required
																		/>
																	</InputGroup>
																</FormGroup>
																<FormGroup className="mb-2">
																	<Label for="adminPwd">Password</Label>
																	<Input
																		type="password"
																		name="adminPwd"
																		id="adminPwd"
																		onChange={e => onAdminFormEdit(e)}
																		value={adminPwd}
																		required
																	/>
																</FormGroup>
																<FormGroup className="mb-2">
																	<Label for="adminCnfPwd">
																		Confirm password
																</Label>
																	<Input
																		type="password"
																		name="adminCnfPwd"
																		id="adminCnfPwd"
																		onChange={e => onAdminFormEdit(e)}
																		value={adminCnfPwd}
																		required
																	/>
																</FormGroup>
																{error ? (
																	<p className="text-danger m-0">
																		Password don't match
																</p>
																) : null}
																<div className="submit__form mt-3">
																	<Button
																		type="submit"
																		color="success"
																		size="lg"
																		block
																	>
																		Add
																</Button>
																</div>
															</Form>
															<div className="user__action--wrapper mt-3 text-center">
																<ListGroup>
																	<ListGroupItem
																		tag="button"
																		action
																		onClick={e => addAdminBack()}
																	>
																		<MdArrowBack /> Go Back
																</ListGroupItem>
																</ListGroup>
															</div>
														</Fragment>
													)}
											</Fragment>
										) : null}
									</Fragment>
								) : null}
							</Fragment>
						) : (
								<Spinner />
							)}
					</div>
				</div>
			</Container>
		</Fragment>
	);
};

AccountManage.propTypes = {
	auth: PropTypes.object.isRequired,
	addAdminSubmit: PropTypes.func.isRequired,
	updateProfile: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
	auth: state.auth,
	addAdminSubmit: PropTypes.func.isRequired,
	updateProfile: PropTypes.func.isRequired
});

export default connect(mapStateToProps, { addAdminSubmit, updateProfile })(
	AccountManage
);
