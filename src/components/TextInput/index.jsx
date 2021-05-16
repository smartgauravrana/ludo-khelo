import React from "react";
import { useField } from "formik";
import PropTypes from "prop-types";

import "./TextInput.scss";

export default function TextInput({ label, ...props }) {
  const [field, meta] = useField(props);

  const formClasses = ["form-control form-group"];
  if(props.type === "checkbox"){
    formClasses.push("form-control-flex");
  }

  return (
    <div className={formClasses.join(" ")}>
      {label && <label htmlFor={props.name}>{label}</label>}
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
