import React from "react";
import { Drawer } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import routePaths from "Routes/routePaths";

import "./HeaderContent.scss";

function HeaderContent({ onMenuClick, drawerVisible, userDetails }) {
  const adminLinks = (
    <Link to={routePaths.ADMIN.manage} onClick={onMenuClick}>
      Manage
    </Link>
  );

  const userLinks = (
    <>
      <Link to={routePaths.HOME} onClick={onMenuClick}>
        Play
      </Link>
      <Link to={routePaths.HISTORY} onClick={onMenuClick}>
        History
      </Link>
      <Link to={routePaths.BUY} onClick={onMenuClick}>
        Buy Chips
      </Link>
      <Link to={routePaths.SELL} onClick={onMenuClick}>
        Sell Chips
      </Link>
    </>
  );

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
        bodyStyle={{ height: "unset" }}
        height={350}
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
            <>
              {userDetails.isAdmin ? adminLinks : userLinks}
              <Link to={routePaths.TERMS} onClick={onMenuClick}>
                Terms &amp; Conditions
              </Link>
              <a href="/api/logout">Logout</a>
              <div>Chips: {userDetails.chips}</div>
            </>
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
