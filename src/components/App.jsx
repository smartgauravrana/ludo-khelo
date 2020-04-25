import React, { useEffect } from "react";
import { Route, Switch, useHistory } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import AppLayout from "components/AppLayout";
import PrivateRoute from "components/PrivateRoute";
import { publicRoutes, privateRoutes } from "Routes";
import { checkLogin } from "redux/modules/userDetails";
import "./App.scss";
import routePaths from "../Routes/routePaths";

function App(props) {
  const { checkLogin } = props;
  const history = useHistory();

  useEffect(() => {
    checkLogin(user => {
      if (user._id) {
        user.isAdmin
          ? history.replace(routePaths.ADMIN.default)
          : history.replace(routePaths.HOME);
      } else {
        history.replace(routePaths.LOGIN);
      }
    });
  }, []);
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

export default connect(({ userDetails }) => ({ userDetails }), { checkLogin })(
  App
);

App.propTypes = {
  userDetails: PropTypes.object,
  checkLogin: PropTypes.func
};
