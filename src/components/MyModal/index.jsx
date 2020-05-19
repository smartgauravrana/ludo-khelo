import React from "react";
import PropTypes from "prop-types";
import { Modal } from "antd";

import "./Modal.scss";

export default function MyModal({ visible, onOk, onCancel, title, children }) {
  return (
    <div className="Modal">
      <Modal title={title} visible={visible} onOk={onOk} onCancel={onCancel}>
        {children}
      </Modal>
    </div>
  );
}

MyModal.propTypes = {
  visible: PropTypes.bool,
  onOk: PropTypes.func,
  onCancel: PropTypes.func,
  title: PropTypes.string,
  children: PropTypes.array
};
