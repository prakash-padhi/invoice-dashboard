import React, { Fragment } from "react";
import { Container } from "reactstrap";
import PropTypes from "prop-types";
import { connect } from "react-redux";

const Users = () => {
	return (
		<Fragment>
			<Container className="themed-container">
				<div className="userData__wrapper">Users</div>
			</Container>
		</Fragment>
	);
};

Users.propTypes = {
	auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	auth: state.auth
});

export default connect(mapStateToProps)(Users);
