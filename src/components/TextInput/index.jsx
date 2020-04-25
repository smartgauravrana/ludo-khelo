import React from "react";
import { useField } from "formik";
import PropTypes from "prop-types";

import "./TextInput.scss";

export default function TextInput({ label, ...props }) {
  const [field, meta] = useField(props);
  return (
    <div className="form-control">
      <label htmlFor={props.name}>{label}</label>
      <input {...field} {...props} />
      {meta.touched && meta.error ? (
        <div className="input-error">{meta.error}</div>
      ) : null}
    </div>
  );
}

TextInput.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string
};
