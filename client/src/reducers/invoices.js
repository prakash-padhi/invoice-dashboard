import { INVOICE_LOADED, AUTH_ERROR, INVOICE_CLEAR } from "../actions/types";

const initialState = {
	invoiceLoading: true,
	invoiceData: null
};

export default function(state = initialState, action) {
	const { type, payload } = action;
	switch (type) {
		case INVOICE_LOADED:
			return {
				...state,
				invoiceLoading: false,
				invoiceData: payload
			};
		case AUTH_ERROR:
		case INVOICE_CLEAR:
			return {
				...state,
				invoiceLoading: false,
				invoiceData: null
			};
		default:
			return state;
	}
}
