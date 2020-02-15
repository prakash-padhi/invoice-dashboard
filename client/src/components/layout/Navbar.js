import React, { useState, Fragment } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/mlogo.png";
import "../../assets/fonts/AliensAndCows.ttf";
import { FiBarChart2 } from "react-icons/fi";
import { FiUser } from "react-icons/fi";
import { FiUsers } from "react-icons/fi";
import { FiLogOut } from "react-icons/fi";
// Redux
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { logout } from "../../actions/auth";

import {
	Collapse,
	Navbar,
	NavbarToggler,
	NavbarBrand,
	Nav,
	NavItem,
	UncontrolledDropdown,
	DropdownToggle,
	DropdownMenu,
	DropdownItem,
	Spinner
} from "reactstrap";

const MyNavbar = ({ auth: { isAuthenticated, loading, user }, logout }) => {
	const [isOpen, setIsOpen] = useState(false);
	const toggle = () => setIsOpen(!isOpen);
	const toggleButton = <NavbarToggler onClick={toggle} />;
	const checkUser = userData => {
		if (userData !== null) {
			return true;
		} else {
			return false;
		}
	};
	const authLinks = (
		<Collapse isOpen={isOpen} navbar>
			<Nav className="ml-auto" navbar>
				<NavItem>
					<Link to="/history" className="nav-link">
						<FiBarChart2 /> History
					</Link>
				</NavItem>
				<NavItem>
					<Link to="/users" className="nav-link">
						<FiUsers /> Users
					</Link>
				</NavItem>
				<UncontrolledDropdown nav inNavbar>
					<DropdownToggle nav caret>
						{isAuthenticated && (
							<Fragment>
								{checkUser(user) ? user.name : <Spinner color="light" />}
							</Fragment>
						)}
					</DropdownToggle>
					<DropdownMenu right>
						<DropdownItem>
							<Link to="/manageAccount">
								<FiUser /> My Account
							</Link>
						</DropdownItem>
						<DropdownItem divider />
						<DropdownItem onClick={logout}>
							<FiLogOut /> Logout
						</DropdownItem>
					</DropdownMenu>
				</UncontrolledDropdown>
			</Nav>
		</Collapse>
	);
	return (
		<div id="navBar__wrapper">
			<Navbar className={!loading ? !isAuthenticated ? "justify-content-center" : "" : ""} color="dark" dark expand="md">
				<NavbarBrand href="/">
					<p className="brandLogo">
						<img src={logo} id="brandLogoImg" alt="Brand Logo" />
						<span className="brandName">MARMETO</span>
					</p>
				</NavbarBrand>
				{!loading && <Fragment>{isAuthenticated && toggleButton}</Fragment>}
				{!loading && <Fragment>{isAuthenticated && authLinks}</Fragment>}
			</Navbar>
		</div>
	);
};

MyNavbar.propTypes = {
	logout: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	auth: state.auth
});

export default connect(mapStateToProps, { logout })(MyNavbar);
