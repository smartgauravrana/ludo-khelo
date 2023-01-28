import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Button, message } from "antd";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import queryString from "query-string";

import { register } from "@/redux/modules/userDetails";
import TextInput from "@/components/TextInput";
import routePaths from "@/Routes/routePaths";
import Loader from "@/components/Loader";
import "./RegisterForm.scss";

const registerFields = [
  {
    name: "name",
    type: "text",
    placeholder: "Full Name",
    // label: "Full Name"
  },
  {
    name: "username",
    type: "text",
    placeholder: "Username",
    // label: "Username"
  },
  {
    name: "phone",
    type: "text",
    placeholder: "Whatsapp Number",
    // label: "Whatsapp Number"
  },
  {
    name: "password",
    type: "password",
    placeholder: "Password",
    // label: "Password"
  },
  {
    name: "confirmPassword",
    type: "password",
    placeholder: "Confirm Password",
    // label: "Confrim Password"
  },
  {
    name: "referrer",
    type: "text",
    placeholder: "Referral Code",
    label: "Referral Code",
  },
];

function RegisterForm({ register }) {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const params = queryString.parse(history.location.search);
  return (
    <div className="RegisterForm">
      <Formik
        initialValues={{
          name: "",
          username: "",
          phone: "",
          password: "",
          confirmPassword: "",
          referrer: params.refer_code || "",
          agreeToTerms: false,
        }}
        validationSchema={Yup.object({
          name: Yup.string().required("Required!"),
          username: Yup.string().required("Required!"),
          phone: Yup.string()
            .required("Required!")
            .length(10, "Mobile should be of 10 digits"),
          password: Yup.string().required("Required!"),
          confirmPassword: Yup.string()
            .required("Required!")
            .test("passwords-match", "Passwords must match!", function (value) {
              return this.parent.password === value;
            }),
          referrer: Yup.string(),
          agreeToTerms: Yup.bool().oneOf(
            [true],
            "Accept Terms & Conditions is required"
          ),
        })}
        onSubmit={(values) => {
          setIsLoading(true);
          register(
            values,
            () => {
              setIsLoading(false);
              history.push(routePaths.LOGIN);
            },
            (err) => {
              setIsLoading(false);
              const { data } = err.response;
              message.error(data.error);
            }
          );
        }}
      >
        {(props) => (
          <Form>
            {registerFields.map((field) => (
              <TextInput
                key={field.name}
                {...field}
                disabled={field.name === "referrer" && params.refer_code}
              />
            ))}
            <div className="termsCheckbox">
              <Field type="checkbox" name="agreeToTerms" />
              <label htmlFor="agreeToTerms">
                I Agree that I am 18 years or older and not a resident of
                Telangana, Assam, Orissa, Kerala, Sikkim, Nagaland or Gujarat.
              </label>
            </div>
            <div className="input-error">{props.errors.agreeToTerms}</div>
            <Button
              className="RegisterForm__SubmitButton"
              type="primary"
              onClick={() => props.isValid && props.submitForm()}
            >
              Submit
            </Button>
          </Form>
        )}
      </Formik>
      {isLoading && <Loader />}
    </div>
  );
}

export default connect(null, { register })(RegisterForm);

RegisterForm.propTypes = {
  submitForm: PropTypes.func,
  register: PropTypes.func,
  isValid: PropTypes.bool,
  errors: PropTypes.object,
};
