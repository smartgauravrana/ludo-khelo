import React from "react";
import { Field, useField } from "formik";
import PropTypes from "prop-types";

import "./TermsCheckbox.scss";
export default function TermsCheckbox(props) {
  const [field, meta] = useField(props);
  return (
    <>
      <div className="termsCheckbox">
        <Field type="checkbox" {...field} {...props} />
        <label htmlFor="agreeToTerms">
          I Agree that I am 18 years or older and not a resident of Telangana,
          Assam, Orissa, Kerala, Sikkim, Nagaland or Gujarat.
        </label>
      </div>
      <div className="input-error">{meta.error}</div>
    </>
  );
}

TermsCheckbox.propTypes = {
  errors: PropTypes.object
};
