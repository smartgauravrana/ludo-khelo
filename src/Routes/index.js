import React from "react";
import routePaths from "./routePaths";
import SocketContext from "context/socket-context";

import Login from "pages/Login";
import Register from "pages/Register";
import Admin from "pages/Admin";
import Home from "pages/Home";
import Buy from "pages/Buy";
import Sell from "pages/Sell";
import TermCondition from "pages/TermCondition";
import MatchDetail from "pages/MatchDetail";
import Timeline from "pages/Timeline";

export const publicRoutes = [
  {
    path: routePaths.LOGIN,
    component: Login,
    exact: true
  },
  {
    path: routePaths.REGISTER,
    component: Register,
    exact: true
  },
  {
    path: routePaths.HOME,
    component: function HomeWithSocket(props) {
      return (
        <SocketContext.Consumer>
          {socket => <Home {...props} socket={socket} />}
        </SocketContext.Consumer>
      );
    },
    exact: true
  },
  {
    path: routePaths.BUY,
    component: Buy,
    exact: true
  },
  {
    path: routePaths.SELL,
    component: Sell,
    exact: true
  },
  {
    path: routePaths.TERMS,
    component: TermCondition,
    exact: true
  },
  {
    path: routePaths.MATCH_DETAIL,
    component: MatchDetail
  },
  {
    path: routePaths.HISTORY,
    component: Timeline
  }
];

export const privateRoutes = [
  {
    path: routePaths.ADMIN.default,
    component: Admin,
    exact: true
  }
];
