import React from "react";
import ReactDom from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";

import App from "@/components/App";
import createStore from "@/redux/create";
import "antd/dist/antd.css";
import "./index.scss";

const app = (
  <Provider store={createStore()}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);

ReactDom.render(app, document.getElementById("root"));
