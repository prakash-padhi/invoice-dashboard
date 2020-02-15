import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route } from "react-router-dom";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";

//ReactDOM.render(<App />, document.getElementById("root"));
const rootElement = document.getElementById("root");
ReactDOM.render(
  <BrowserRouter>
    <Route path='/' component={App} />
  </BrowserRouter>,
  rootElement
);
