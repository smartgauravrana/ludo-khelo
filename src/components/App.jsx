import React, { useEffect } from "react";
import { Route, Switch, useHistory } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import socketIOClient from "socket.io-client";

import AppLayout from "components/AppLayout";
import PrivateRoute from "components/PrivateRoute";
import { publicRoutes, privateRoutes } from "Routes";
import { checkLogin } from "redux/modules/userDetails";
import SocketContext from "context/socket-context";
import { SOCKET_CONFIG } from "config";
import "./App.scss";
import routePaths from "../Routes/routePaths";

const ENDPOINT = SOCKET_CONFIG.endpoint;
console.log(ENDPOINT);
const socket = socketIOClient(ENDPOINT);
function App(props) {
  const { checkLogin } = props;
  const history = useHistory();

  useEffect(() => {
    checkLogin(user => {
      if (!user._id) {
        history.replace(routePaths.LOGIN);
      }
    });
  }, []);
  return (
    <SocketContext.Provider value={socket}>
      <div className="App">
        <AppLayout>
          <Switch>
            {publicRoutes.map(route => (
              <Route key={route.path} {...route} abc={true} />
            ))}
            {privateRoutes.map(route => (
              <PrivateRoute key={route.path} {...route} />
            ))}
          </Switch>
        </AppLayout>
      </div>
    </SocketContext.Provider>
  );
}

export default connect(({ userDetails }) => ({ userDetails }), { checkLogin })(
  App
);

App.propTypes = {
  userDetails: PropTypes.object,
  checkLogin: PropTypes.func
};
