import React from "react";
import ReactDOM from "react-dom";
import { Space, Spin } from "antd";
import PropTypes from "prop-types";

import "./Loader.scss";

export default function Loader({ style }) {
  return ReactDOM.createPortal(
    <div className="Loader" style={style}>
      <Space size="middle">
        <Spin size="large" />
      </Space>
    </div>,
    document.getElementById("portals")
  );
}

Loader.propTypes = {
  style: PropTypes.object
};
