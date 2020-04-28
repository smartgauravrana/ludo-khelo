import React from "react";
import PropTypes from "prop-types";

import "./CustomTitle.scss";

export default function CustomTitle({ title }) {
  return (
    <p className="CustomTitle">
      {title}
      <br />
      <span className="text-info" style={{ fontSize: "25px" }}>
        (1Rupee = 1Chip)
      </span>
    </p>
  );
}

CustomTitle.propTypes = {
  title: PropTypes.string
};
