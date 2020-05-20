import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Button, message } from "antd";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";

import { login } from "redux/modules/userDetails";
import TextInput from "components/TextInput";
import routePaths from "Routes/routePaths";
import "./LoginForm.scss";

const loginFields = [
  {
    name: "phone",
    type: "text",
    placeholder: "Enter Mobile Number",
    label: "Mobile Number"
  },
  {
    name: "password",
    type: "password",
    placeholder: "Password",
    label: "Password"
  }
];

function LoginForm({ login }) {
  const history = useHistory();
  return (
    <div className="LoginForm">
      <Formik
        initialValues={{
          phone: "",
          password: ""
        }}
        validationSchema={Yup.object({
          phone: Yup.string()
            .required("Required!")
            .length(10, "Mobile should be of 10 digits"),
          password: Yup.string().required("Required!")
        })}
        onSubmit={values =>
          login(
            values,
            userDetails => {
              message.success("Success");
              if (userDetails.isAdmin) {
                return history.push(routePaths.ADMIN.default);
              }
              history.push(routePaths.HOME);
            },
            err => {
              const { data } = err.response;
              message.error(data.msg);
            }
          )
        }
      >
        {props => (
          <Form>
            {loginFields.map(field => (
              <TextInput key={field.name} {...field} />
            ))}
            <Button
              className="LoginForm__LoginButton"
              type="primary"
              onClick={() => props.isValid && props.submitForm()}
            >
              Submit
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default connect(null, { login })(LoginForm);

LoginForm.propTypes = {
  submitForm: PropTypes.func,
  login: PropTypes.func,
  isValid: PropTypes.bool
};
