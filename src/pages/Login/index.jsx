import React from "react";
import { Link } from "react-router-dom";

import routePaths from "@/Routes/routePaths";
import LoginForm from "@/components/LoginForm";
import "./Login.scss";
import QueryNotice from "@/components/QueryNotice";

export default function Login() {
  return (
    <div className="Login">
      <h1>Login</h1>
      <LoginForm />
      <div className="Login__NewUser">
        New User? <Link to={routePaths.REGISTER}>Register Here</Link>
      </div>
      <QueryNotice />
    </div>
  );
}
