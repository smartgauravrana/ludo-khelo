import React, { useState } from "react";
import PropTypes from "prop-types";

import { MATCH_STATUS } from "../../../constants";
import "./Filter.scss";

export default function Filter({ initialValue, onChange, options }) {
  const [value, setValue] = useState(initialValue);
  const handleChange = event => {
    const selectedValue = event.target.value;
    setValue(selectedValue);
    onChange(selectedValue);
  };
  return (
    <div className="Filter">
      <div>
        Filter
        <select value={value} onChange={handleChange}>
          {Object.keys(options).map(key => (
            <option key={key} value={key}>
              {key}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

Filter.propTypes = {
  initialValue: PropTypes.string,
  onChange: PropTypes.func,
  options: PropTypes.object
};

Filter.default = {
  initialValue: "",
  options: { MATCH_STATUS }
};
