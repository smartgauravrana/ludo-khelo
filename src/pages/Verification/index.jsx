import React from "react";
import PropTypes from "prop-types";
import { Button } from "antd";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import TextInput from "@/components/TextInput";
import "firebase/auth";

export default function Verification(props) {
  return (
    <div className="Verification">
      <h1>Phone verification</h1>
      <h3>Enter your Whatsapp Number</h3>
      {console.log(props)}
      <Formik
        initialValues={{
          phone: "",
          otp: "",
        }}
        validationSchema={Yup.object({
          phone: Yup.string()
            .required("Required!")
            .length(10, "Mobile should be of 10 digits"),
          // otp: Yup.string().required("Required!")
        })}
        onSubmit={(values) => {
          // signIn(values.phone, window.recaptchaVerifier);
        }}
      >
        {(props) => {
          return (
            <Form>
              <div>
                <TextInput label="Phone Number" name="phone" type="text" />
                {/* <button id="sign-in-button">Submit</button> */}
                <Button
                  id="sign-in-button"
                  onClick={() => props.isValid && props.submitForm()}
                >
                  Submit
                </Button>
              </div>
            </Form>
          );
        }}
      </Formik>
      <div id="recaptcha-container"></div>
    </div>
  );
}

Verification.propTypes = {
  isValid: PropTypes.bool,
  submitForm: PropTypes.func,
};
