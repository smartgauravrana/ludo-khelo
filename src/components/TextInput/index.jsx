import React from "react";
import { useField } from "formik";
import { Alert } from "antd";
import PropTypes from "prop-types";

export default function TextInput({ label, ...props }) {
  const [field, meta] = useField(props);
  console.log("field", field, meta, props);
  return (
    <div className="form-control">
      <label htmlFor={props.name}>{label}</label>
      <input {...field} {...props} />
      {meta.touched && meta.error ? (
        <Alert message={meta.error} type="error" />
      ) : null}
    </div>
  );
}

TextInput.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string
};
