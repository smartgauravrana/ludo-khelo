import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import {
  getMatchesStats,
  getUsersStats,
  resetDashboard,
  setFilter,
  DASHBOARD_FILTERS
} from "redux/modules/dashboard";
import Filter from "components/Filter";
import Loader from "components/Loader";
import "./Dashboard.scss";

class Dashboard extends Component {
  componentDidMount() {
    const { getMatchesStats, getUsersStats } = this.props;
    getMatchesStats();
    getUsersStats();
  }

  componentDidUpdate(prevProps) {
    const { filter, getMatchesStats, getUsersStats } = this.props;
    if (prevProps.filter !== filter) {
      getMatchesStats();
      getUsersStats();
    }
  }

  componentWillUnmount() {
    const { resetDashboard } = this.props;
    resetDashboard();
  }

  render() {
    const {
      users,
      totalMatches,
      completedMatches,
      isUsersLoading,
      isMatchesLoading,
      filter,
      setFilter
    } = this.props;
    return (
      <div className="Dashboard">
        <h1>Dashboard</h1>
        <Filter
          initialValue={filter}
          onChange={val => setFilter(DASHBOARD_FILTERS[val])}
          options={DASHBOARD_FILTERS}
        />
        {isUsersLoading || isMatchesLoading ? (
          <Loader />
        ) : (
          <>
            <h2>Matches Data</h2>
            <div className="Dashboard__Matches">
              <div className="Dashboard__Item">
                <div className="Dashboard__Info">
                  <div>
                    Matches Completed:{" "}
                    <strong>{completedMatches.matchesNumber}</strong>
                  </div>
                </div>
                <div className="Dashboard__Info">
                  {" "}
                  Profit Earned: <strong>Rs.{completedMatches.profit}</strong>
                </div>
              </div>
              <div className="Dashboard__Item">
                <div className="Dashboard__Info">
                  Total Matches: <strong>{totalMatches.matchesNumber} </strong>
                  <strong>
                    (
                    {totalMatches.matchesNumber -
                      completedMatches.matchesNumber}{" "}
                    Others + {completedMatches.matchesNumber} Completed)
                  </strong>
                </div>
                <div className="Dashboard__Info">
                  Profit Pending:{" "}
                  <strong>
                    Rs.{totalMatches.profit - completedMatches.profit}
                  </strong>
                </div>
              </div>
            </div>

            <h2>Users Data</h2>
            <div className="Dashboard__Users">
              <div className="Dashboard__Item">
                <div className="Dashboard__Info">
                  <div>
                    User Registered: <strong>{users.total}</strong>
                  </div>
                </div>
                <div className="Dashboard__Info">
                  Zombie Users: <strong>{users.zombieUsers}</strong>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }
}

export default connect(
  ({
    dashboard: {
      users,
      totalMatches,
      completedMatches,
      isUsersLoading,
      isMatchesLoading,
      filter
    }
  }) => ({
    users,
    totalMatches,
    completedMatches,
    isUsersLoading,
    isMatchesLoading,
    filter
  }),
  {
    getMatchesStats,
    getUsersStats,
    resetDashboard,
    setFilter
  }
)(Dashboard);

Dashboard.propTypes = {
  getMatchesStats: PropTypes.func,
  getUsersStats: PropTypes.func,
  users: PropTypes.object,
  totalMatches: PropTypes.object,
  completedMatches: PropTypes.object,
  isUsersLoading: PropTypes.bool,
  isMatchesLoading: PropTypes.bool,
  resetDashboard: PropTypes.func,
  filter: PropTypes.string,
  setFilter: PropTypes.func
};
