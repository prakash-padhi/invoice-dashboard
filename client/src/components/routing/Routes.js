import React from "react";
import { Route, Switch } from "react-router-dom";
import History from "../dashboard/History";
import Users from "../dashboard/Users";
import AccountManage from "../dashboard/AccountManage";
import Dashboard from "../dashboard/Dashboard";
import NotFound from "../layout/NotFound";
import PrivateRoute from "../routing/PrivateRoute";

const Routes = () => {
	return (
		<Switch>
			<PrivateRoute path="/dashboard" component={Dashboard} />
			<PrivateRoute exact path="/history" component={History} />
			<PrivateRoute exact path="/users" component={Users} />
			<PrivateRoute exact path="/manageAccount" component={AccountManage} />
			<Route path="*" component={NotFound} />
		</Switch>
	);
};

export default Routes;
