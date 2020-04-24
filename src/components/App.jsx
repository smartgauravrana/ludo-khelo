import React from "react";
import { Route, Switch } from "react-router-dom";

import AppLayout from "components/AppLayout";
import Login from "pages/Login";
import Register from "pages/Register";
import "./App.scss";

export default function App() {
  return (
    <div className="App">
      <AppLayout>
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
        </Switch>
      </AppLayout>
    </div>
  );
}
