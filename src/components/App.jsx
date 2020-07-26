import React, { useEffect, useState } from "react";
import { Route, Switch, useHistory } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import socketIOClient from "socket.io-client";
import TagManager from "react-gtm-module";

import AppLayout from "components/AppLayout";
import PrivateRoute from "components/PrivateRoute";
import { publicRoutes, privateRoutes } from "Routes";
import { checkLogin } from "redux/modules/userDetails";
import { fetchSettings } from "redux/modules/settings";
import SocketContext from "context/socket-context";
import Loader from "components/Loader";
import { SOCKET_CONFIG, GTM_ID } from "config";
import "./App.scss";
import routePaths from "../Routes/routePaths";

const ENDPOINT = SOCKET_CONFIG.endpoint;
const socket = socketIOClient(ENDPOINT);

// GTM working
const tagManagerArgs = {
  gtmId: GTM_ID
};

TagManager.initialize(tagManagerArgs);
function App(props) {
  const { checkLogin, fetchSettings } = props;
  const [isUserFetching, setIsUserFetching] = useState(true);
  const history = useHistory();

  useEffect(() => {
    checkLogin(
      user => {
        setIsUserFetching(false);
        if (!user._id) {
          history.replace(routePaths.HOME);
        }
      },
      () => setIsUserFetching(false)
    );
    fetchSettings();
  }, []);
  return (
    <SocketContext.Provider value={socket}>
      <div className="App">
        {!isUserFetching ? (
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
        ) : (
          <Loader />
        )}
      </div>
    </SocketContext.Provider>
  );
}

export default connect(({ userDetails }) => ({ userDetails }), {
  checkLogin,
  fetchSettings
})(App);

App.propTypes = {
  userDetails: PropTypes.object,
  checkLogin: PropTypes.func,
  fetchSettings: PropTypes.func
};
