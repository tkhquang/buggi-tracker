import React from "react";
import ReactDOM from "react-dom";
import { HelmetProvider } from "react-helmet-async";

import * as serviceWorker from "./serviceWorker";

import App from "./App";

import "./assets/styles/index.scss";

ReactDOM.render(
  <React.StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
