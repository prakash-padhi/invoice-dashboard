import axios from "axios";
import { setAlert } from "./alert";
import { loadInvoices } from "./auth";

// Accept invoice
export const acceptInvoice = id => async dispatch => {
	try {
		const config = {
			headers: {
				"Content-Type": "application/json"
			}
		};
		const body = JSON.stringify({ id });
		const res = await axios.put("/api/invoices/accept", body, config);
		dispatch(loadInvoices());
	} catch (err) {
		const errors = err.response.data.errors;
		if (errors) {
			errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
		}
	}
};

// Reject invoice
export const rejectInvoice = (id, rejectReason) => async dispatch => {
	try {
		const config = {
			headers: {
				"Content-Type": "application/json"
			}
		};
		const body = JSON.stringify({ id, rejectReason });
		const res = await axios.put("/api/invoices/reject", body, config);
		dispatch(loadInvoices());
	} catch (err) {
		const errors = err.response.data.errors;
		if (errors) {
			errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
		}
	}
};

// Paid invoice
export const paidInvoice = id => async dispatch => {
	try {
		const config = {
			headers: {
				"Content-Type": "application/json"
			}
		};
		const body = JSON.stringify({ id });
		const res = await axios.put("/api/invoices/paid", body, config);
		dispatch(loadInvoices());
	} catch (err) {
		const errors = err.response.data.errors;
		if (errors) {
			errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
		}
	}
};
