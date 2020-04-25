import routePaths from "./routePaths";

import Login from "pages/Login";
import Register from "pages/Register";
import Admin from "pages/Admin";

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
  }
];

export const privateRoutes = [
  {
    path: routePaths.ADMIN.default,
    component: Admin,
    exact: true
  }
];
