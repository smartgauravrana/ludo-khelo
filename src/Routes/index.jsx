import React from "react";
import loadable from "@loadable/component";
import { Skeleton } from "antd";
import routePaths from "./routePaths";
import SocketContext from "@/context/socket-context";

// import Login from "@/pages/Login";
// import Register from "@/pages/Register";
// import Admin from "@/pages/Admin";
// import Home from "@/pages/Home";
// import Buy from "@/pages/Buy";
// import Sell from "@/pages/Sell";
// import Timeline from "@/pages/Timeline";
// import Manage from "@/pages/Manage";

import MatchDetail from "@/pages/MatchDetail";
import TermCondition from "@/pages/TermCondition";
import Settings from "@/pages/Settings";
import Verification from "@/pages/Verification";
import Dashboard from "@/pages/Dashboard";
import ManageWithdrawls from "@/pages/ManageWithdrawls";
import Users from "@/pages/Users";
import Billing from "@/pages/Billing";

const Login = loadable(
  () => import(/* webpackChunkName: "Login" */ "@/pages/Login"),
  {
    fallback: <Skeleton />,
  }
);

const Register = loadable(
  () => import(/* webpackChunkName: "Register" */ "@/pages/Register"),
  {
    fallback: <Skeleton />,
  }
);

const Home = loadable(
  () => import(/* webpackChunkName: "Home" */ "@/pages/Home"),
  {
    fallback: <Skeleton />,
  }
);

const Buy = loadable(
  () => import(/* webpackChunkName: "Buy" */ "@/pages/Buy"),
  {
    fallback: <Skeleton />,
  }
);

const Sell = loadable(
  () => import(/* webpackChunkName: "Sell" */ "@/pages/Sell"),
  {
    fallback: <Skeleton />,
  }
);

const Timeline = loadable(
  () => import(/* webpackChunkName: "Timeline" */ "@/pages/Timeline"),
  {
    fallback: <Skeleton />,
  }
);

const Admin = loadable(
  () => import(/* webpackChunkName: "Admin" */ "@/pages/Admin"),
  {
    fallback: <Skeleton />,
  }
);

const Manage = loadable(
  () => import(/* webpackChunkName: "Manage" */ "@/pages/Manage"),
  {
    fallback: <Skeleton />,
  }
);

const Support = loadable(
  () => import(/* webpackChunkName: "Support" */ "@/pages/Support"),
  {
    fallback: <Skeleton />,
  }
);

const Referral = loadable(
  () => import(/* webpackChunkName: "Referral" */ "@/pages/Referral"),
  {
    fallback: <Skeleton />,
  }
);

export const publicRoutes = [
  {
    path: routePaths.LOGIN,
    component: Login,
    exact: true,
  },
  {
    path: routePaths.REGISTER,
    component: Register,
    exact: true,
  },
  {
    path: routePaths.HOME,
    component: function HomeWithSocket(props) {
      return (
        <SocketContext.Consumer>
          {(socket) => <Home {...props} socket={socket} />}
        </SocketContext.Consumer>
      );
    },
    exact: true,
  },
  {
    path: routePaths.BUY,
    component: Buy,
    exact: true,
  },
  {
    path: routePaths.SELL,
    component: Sell,
    exact: true,
  },
  {
    path: routePaths.TERMS,
    component: TermCondition,
    exact: true,
  },
  {
    path: routePaths.MATCH_DETAIL,
    component: MatchDetail,
  },
  {
    path: routePaths.HISTORY,
    component: Timeline,
  },
  {
    path: routePaths.VERIFICATION,
    component: Verification,
  },
  {
    path: routePaths.BILLING,
    component: Billing,
    exact: true,
  },
  {
    path: routePaths.SUPPORT,
    component: Support,
    exact: true,
  },
  {
    path: routePaths.REFERRAL,
    component: Referral,
    exact: true,
  },
];

export const privateRoutes = [
  {
    path: routePaths.ADMIN.default,
    component: Admin,
    exact: true,
  },
  {
    path: routePaths.ADMIN.manage,
    component: Manage,
    exact: true,
  },
  { path: routePaths.ADMIN.dashboard, component: Dashboard, exact: true },
  { path: routePaths.ADMIN.settings, component: Settings, exact: true },
  {
    path: routePaths.ADMIN.manageWithdrawls,
    component: ManageWithdrawls,
    exact: true,
  },
  { path: routePaths.ADMIN.users, component: Users, exact: true },
];
