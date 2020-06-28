import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { getMatchesStats, getUsersStats } from "redux/modules/dashboard";

class Dashboard extends Component {
  componentDidMount() {
    const { getMatchesStats, getUsersStats } = this.props;
    getMatchesStats();
    getUsersStats();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.matches !== this.props.matches) {
      console.log(this.props.matches);
    }
  }

  render() {
    return <h1>Dashboard</h1>;
  }
}

export default connect(
  ({ dashboard: { matches, users } }) => ({
    matches,
    users
  }),
  {
    getMatchesStats,
    getUsersStats
  }
)(Dashboard);

Dashboard.propTypes = {
  getMatchesStats: PropTypes.func,
  getUsersStats: PropTypes.func,
  matches: PropTypes.array,
  users: PropTypes.object
};
