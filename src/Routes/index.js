import React from "react";
import loadable from "@loadable/component";
import routePaths from "./routePaths";
import SocketContext from "context/socket-context";

// import Login from "pages/Login";
// import Register from "pages/Register";
// import Admin from "pages/Admin";
// import Home from "pages/Home";
// import Buy from "pages/Buy";
// import Sell from "pages/Sell";
// import Timeline from "pages/Timeline";
// import Manage from "pages/Manage";

import MatchDetail from "pages/MatchDetail";
import TermCondition from "pages/TermCondition";
import Settings from "pages/Settings";

const Login = loadable(() =>
  import(/* webpackChunkName: "Login" */ "pages/Login")
);

const Register = loadable(() =>
  import(/* webpackChunkName: "Register" */ "pages/Register")
);

const Home = loadable(() =>
  import(/* webpackChunkName: "Home" */ "pages/Home")
);

const Buy = loadable(() => import(/* webpackChunkName: "Buy" */ "pages/Buy"));

const Sell = loadable(() =>
  import(/* webpackChunkName: "Sell" */ "pages/Sell")
);

const Timeline = loadable(() =>
  import(/* webpackChunkName: "Timeline" */ "pages/Timeline")
);

const Admin = loadable(() =>
  import(/* webpackChunkName: "Admin" */ "pages/Admin")
);

const Manage = loadable(() =>
  import(/* webpackChunkName: "Managae" */ "pages/Manage")
);

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
  },
  {
    path: routePaths.ADMIN.manage,
    component: Manage,
    exact: true
  },
  { path: routePaths.ADMIN.settings, component: Settings, exact: true }
];
