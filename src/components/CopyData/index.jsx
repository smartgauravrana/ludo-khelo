import React from "react";
import Clipboard from "react-clipboard.js";
import PropTypes from "prop-types";

import "./CopyData.scss";

export default function CopyData({ data, title }) {
  return (
    <Clipboard data-clipboard-text={data} className="copy-btn">
      {title}
    </Clipboard>
  );
}

CopyData.propTypes = {
  data: PropTypes.string,
  title: PropTypes.string
};
