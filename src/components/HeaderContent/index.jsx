import React from "react";
import { Drawer } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

export default function HeaderContent({ onMenuClick, drawerVisible }) {
  return (
    <>
      <div className="header">
        <div className="header__title">Welcome</div>
        <MenuOutlined className="header__menu--icon" onClick={onMenuClick} />
      </div>
      <Drawer
        title="Menu"
        placement="top"
        closable={true}
        onClose={onMenuClick}
        visible={drawerVisible}
      >
        <div className="drawable-items">
          <Link to="/login" onClick={onMenuClick}>
            Login
          </Link>
          <Link to="/register" onClick={onMenuClick}>
            Register
          </Link>
        </div>
      </Drawer>
    </>
  );
}

HeaderContent.propTypes = {
  onMenuClick: PropTypes.func,
  drawerVisible: PropTypes.bool
};
