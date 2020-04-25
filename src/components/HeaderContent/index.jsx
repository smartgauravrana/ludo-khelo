import React from "react";
import { Drawer } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import "./HeaderContent.scss";

function HeaderContent({ onMenuClick, drawerVisible, userDetails }) {
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
          {!userDetails._id ? (
            <>
              <Link to="/login" onClick={onMenuClick}>
                Login
              </Link>
              <Link to="/register" onClick={onMenuClick}>
                Register
              </Link>
            </>
          ) : (
            <a href="/api/logout">Logout</a>
          )}
        </div>
      </Drawer>
    </>
  );
}

export default connect(
  ({ userDetails }) => ({ userDetails }),
  null
)(HeaderContent);

HeaderContent.propTypes = {
  onMenuClick: PropTypes.func,
  drawerVisible: PropTypes.bool,
  userDetails: PropTypes.object
};
