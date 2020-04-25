import routePaths from "./routePaths";

import Login from "pages/Login";
import Register from "pages/Register";

export const publicRoutes = [
  {
    path: routePaths.LOGIN,
    component: Login
  },
  {
    path: routePaths.REGISTER,
    component: Register
  }
];

export const privateRoutes = [];
