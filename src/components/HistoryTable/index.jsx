import React, { Component } from "react";
import { connect } from "react-redux";
import { message } from "antd";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";

import { getTimeline } from "redux/modules/timeline";
import MatchActions from "components/MatchActions";
import DisplayTable from "components/DisplayTable";
import { leaveMatch } from "redux/modules/matchDetails";
import { checkLogin } from "redux/modules/userDetails";
import "./HistoryTable.scss";
import routePaths from "Routes/routePaths";

class HistoryTable extends Component {
  componentDidMount() {
    const { location } = this.props;
    const page = location.search.split("?page=").pop();
    this.props.getTimeline({ page });
  }

  componentDidUpdate(prevProps) {
    const { location, getTimeline } = this.props;
    if (prevProps.location.search !== location.search) {
      getTimeline({ page: location.search.split("?page=").pop() });
    }
  }

  columns = [
    {
      title: "Match ID",
      dataIndex: "_id",
      ellipsis: true
    },
    {
      title: "Title VS",
      dataIndex: "createdBy",
      // eslint-disable-next-line react/display-name
      render: (createdBy, record) => {
        if (record.joinee && record.joinee.username) {
          return (
            <div>
              {createdBy.username} vs {record.joinee.username} for{" "}
              {record.amount}
            </div>
          );
        }
        return (
          <div>
            {createdBy.username} have set a challenge for{" "}
            <strong>&#8377;{record.amount}</strong>
          </div>
        );
      }
    },
    {
      title: "Status",
      dataIndex: "status"
    },
    {
      title: "Action",
      dataIndex: "resultsPosted",
      render: (results, record) => {
        return (
          <MatchActions
            content={record}
            user={this.props.userDetails}
            cancelRequest={() => this.cancelRequest(record)}
          />
        );
      }
    }
  ];

  cancelRequest = content => {
    const { leaveMatch, checkLogin } = this.props;
    leaveMatch(
      content,
      () => checkLogin(),
      err => {
        const { data } = err.response;
        message.error(data.msg);
      }
    );
  };

  render() {
    const { timeline, isLoading, total, history } = this.props;
    return (
      <div className="HistoryTable">
        <DisplayTable
          rowKey="_id"
          dataSource={timeline}
          columns={this.columns}
          loading={isLoading}
          paginationProps={{
            total: total,
            onChange: currentPage => {
              history.push(
                `${routePaths.HISTORY}${
                  currentPage !== 1 ? "?page=" + currentPage : ""
                }`
              );
            }
          }}
        />
      </div>
    );
  }
}

export default withRouter(
  connect(
    ({ timeline: { timeline, isLoading, total }, userDetails }) => ({
      timeline,
      isLoading,
      total,
      userDetails
    }),
    {
      getTimeline,
      leaveMatch,
      checkLogin
    }
  )(HistoryTable)
);

HistoryTable.propTypes = {
  getTimeline: PropTypes.func,
  total: PropTypes.number,
  isLoading: PropTypes.bool,
  timeline: PropTypes.array,
  leaveMatch: PropTypes.func,
  checkLogin: PropTypes.func,
  userDetails: PropTypes.object,
  location: PropTypes.object,
  history: PropTypes.object
};
