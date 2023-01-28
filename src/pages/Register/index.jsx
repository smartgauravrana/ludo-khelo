import React from "react";
import { Link } from "react-router-dom";

import routePaths from "@/Routes/routePaths";
import RegisterForm from "@/components/RegisterForm";

import "./Register.scss";

export default function Register() {
  return (
    <div className="Register">
      <h1>Register</h1>
      <RegisterForm />
      <div className="Register__NewUser">
        Old User? <Link to={routePaths.LOGIN}>Sign in</Link>
      </div>
    </div>
  );
}
