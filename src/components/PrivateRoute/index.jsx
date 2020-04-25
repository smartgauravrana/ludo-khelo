import React from "react";
import { connect } from "react-redux";
import { Route } from "react-router-dom";
import PropTypes from "prop-types";

function PrivateRoute({ isAdmin, ...rest }) {
  return isAdmin ? <Route {...rest} /> : null;
}

export default connect(({ userDetails: { isAdmin } }) => ({ isAdmin }), null);

PrivateRoute.propTypes = {
  isAdmin: PropTypes.bool
};

PrivateRoute.defaultProps = {
  isAdmin: false
};
