import { combineReducers } from "redux";
import alert from "./alert";
import auth from "./auth";
import invoices from "./invoices";

export default combineReducers({
	alert,
	auth,
	invoices
});
