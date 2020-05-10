import routePaths from "./routePaths";

import Login from "pages/Login";
import Register from "pages/Register";
import Admin from "pages/Admin";
import Home from "pages/Home";
import Buy from "pages/Buy";
import Sell from "pages/Sell";
import TermCondition from "pages/TermCondition";
import MatchDetail from "pages/MatchDetail";

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
    component: Home,
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
  }
];

export const privateRoutes = [
  {
    path: routePaths.ADMIN.default,
    component: Admin,
    exact: true
  }
];
