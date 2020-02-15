import axios from "axios";
import { setAlert } from "./alert";
import setAuthToken from "../utils/setAuthToken";
import {
	LOGIN_SUCCESS,
	LOGIN_FAIL,
	USER_LOADED,
	AUTH_ERROR,
	LOGOUT,
	INVOICE_LOADED,
	INVOICE_CLEAR
} from "./types";

// Update User
export const updateProfile = (id, name, email, mobile) => async dispatch => {
	const config = {
		headers: {
			"Content-Type": "application/json"
		}
	};

	const body = JSON.stringify({ id, name, email, mobile });
	try {
		const res = await axios.put("/api/login/profileUpdate", body, config);
		dispatch(setAlert(res.data.successMsg, "success"));
		dispatch(loadUser());
		return true;
	} catch (err) {
		const errors = err.response.data.errors;
		if (errors) {
			errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
		}
	}
};

// Add Admin
export const addAdminSubmit = (
	name,
	email,
	mobile,
	password
) => async dispatch => {
	const config = {
		headers: {
			"Content-Type": "application/json"
		}
	};

	const body = JSON.stringify({ name, email, mobile, password });
	try {
		const res = await axios.post("/api/register", body, config);
		dispatch(setAlert(res.data.successMsg, "success"));
		return true;
	} catch (err) {
		const errors = err.response.data.errors;
		if (errors) {
			errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
		}
	}
};

// Load All Invoices
export const loadInvoices = () => async dispatch => {
	try {
		const res = await axios.get("/api/invoices");
		dispatch({
			type: INVOICE_LOADED,
			payload: res.data
		});
	} catch (err) {
		dispatch({
			type: AUTH_ERROR
		});
	}
};

// Load User
export const loadUser = () => async dispatch => {
	if (localStorage.token) {
		setAuthToken(localStorage.token);
	}
	try {
		const res = await axios.get("/api/login");
		if (res.data !== null) {
			dispatch({
				type: USER_LOADED,
				payload: res.data
			});
		} else {
			dispatch({ type: LOGOUT });
			dispatch({ type: INVOICE_CLEAR });
			dispatch(setAlert("Authentication error.", "danger"));
		}
	} catch (err) {
		dispatch({
			type: AUTH_ERROR
		});
	}
};

// Login User
export const login = (email, password) => async dispatch => {
	const config = {
		headers: {
			"Content-Type": "application/json"
		}
	};

	const body = JSON.stringify({ email, password });

	try {
		const res = await axios.post("/api/login", body, config);
		dispatch(setAlert("Login successfull.", "success"));
		dispatch({
			type: LOGIN_SUCCESS,
			payload: res.data
		});
		dispatch(loadUser());
		dispatch(loadInvoices());
	} catch (err) {
		const errors = err.response.data.errors;
		if (errors) {
			errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
		}
		dispatch({
			type: LOGIN_FAIL
		});
	}
};

// Logout / Clear Profile
export const logout = () => dispatch => {
	dispatch({ type: LOGOUT });
	dispatch({ type: INVOICE_CLEAR });
	dispatch(setAlert("Logout successfull.", "success"));
};
