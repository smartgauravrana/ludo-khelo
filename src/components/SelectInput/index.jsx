import React from "react";
import { useField } from "formik";
import PropTypes from "prop-types";

import "./SelectInput.scss";

export default function SelectInput({ label, options, ...props }) {
  const [field, meta] = useField(props);
  return (
    <div className="form-control">
      {label && <label htmlFor={props.name}>{label}</label>}
      <select {...field} {...props}>
        {options.map(optionItem => (
          <option key={label} label={optionItem} value={optionItem} />
        ))}
      </select>
      {meta.touched && meta.error ? (
        <div className="input-error">{meta.error}</div>
      ) : null}
    </div>
  );
}

SelectInput.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string,
  options: PropTypes.array
};
