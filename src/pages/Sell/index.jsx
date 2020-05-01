import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Button } from "antd";
import PropTypes from "prop-types";

import CustomTitle from "components/CustomTitle";
import SelectInput from "components/SelectInput";
import TextInput from "components/TextInput";
import { connect } from "react-redux";
import "./Sell.scss";
import TermsCheckbox from "components/TermsCheckbox";

const sellFields = [
  {
    name: "phone",
    type: "number",
    placeholder: "Paytm Number"
  },
  {
    name: "amount",
    type: "number",
    placeholder: "Chips Amount"
  }
];

function Sell({ userDetails }) {
  const noticeInfo = (
    <>
      <CustomTitle title="Sell Chips" />
      <p className="text-primary">(Processing Timing: 06:00 PM)</p>
      <div
        style={{ padding: "5px", border: "2px dotted", borderRadius: "10px" }}
      >
        <p className="text-info blink" style={{ fontSize: "22px" }}>
          Only{" "}
          <span className="text-dark">
            <b>2 request</b>
          </span>{" "}
          allowed per day.
        </p>
        <p className="text-info blink" style={{ fontSize: "19px" }}>
          एक दिन में सिर्फ{" "}
          <span className="text-dark">
            <b>2 रिकवेस्ट</b>
          </span>{" "}
          ही ली जाएगी |
        </p>
      </div>{" "}
    </>
  );
  return (
    <div className="Sell">
      <div className="Sell__Header">{noticeInfo}</div>
      <div className="Sell__form">
        <Formik
          initialValues={{
            walletType: "Paytm",
            phone: "",
            amount: "",
            agreeToTerms: false
          }}
          validationSchema={Yup.object({
            phone: Yup.string()
              .required("Required")
              .length(10, "Mobile should be of 10 digits"),
            amount: Yup.number()
              .required("Required!")
              .min(50, "Minimum amount is 50!")
              .max(userDetails.chips, "You don't have enough chips!"),
            agreeToTerms: Yup.bool().oneOf(
              [true],
              "Accept Terms & Conditions is required"
            )
          })}
          onSubmit={console.log}
        >
          {props => (
            <Form>
              <SelectInput name="walletType" options={["Paytm"]} />
              {sellFields.map(field => (
                <TextInput key={field.name} {...field} />
              ))}
              <TermsCheckbox name="agreeToTerms" type="checkbox" />

              <Button
                className="Load_btn"
                type="success"
                onClick={() => props.isValid && props.submitForm()}
              >
                Sell
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default connect(({ userDetails }) => ({ userDetails }))(Sell);

Sell.propTypes = {
  userDetails: PropTypes.object,
  isValid: PropTypes.bool,
  submitForm: PropTypes.func
};
