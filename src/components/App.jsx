import React from "react";
import { Route, Switch } from "react-router-dom";

import AppLayout from "components/AppLayout";
import PrivateRoute from "components/PrivateRoute";
import { publicRoutes, privateRoutes } from "Routes";
import "./App.scss";

export default function App() {
  return (
    <div className="App">
      <AppLayout>
        <Switch>
          {publicRoutes.map(route => (
            <Route key={route.path} {...route} />
          ))}
          {privateRoutes.map(route => (
            <PrivateRoute key={route.path} {...route} />
          ))}
        </Switch>
      </AppLayout>
    </div>
  );
}
