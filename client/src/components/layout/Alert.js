import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { UncontrolledAlert } from "reactstrap";

const Alert = ({ alerts }) =>
	alerts !== null &&
	alerts.length > 0 &&
	alerts.map(alert => (
		<UncontrolledAlert key={alert.id} color={`${alert.alertType}`}>
			{alert.msg}
		</UncontrolledAlert>
	));

Alert.propTypes = {
	alerts: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
	alerts: state.alert
});

export default connect(mapStateToProps)(Alert);
