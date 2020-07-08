import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Button } from "antd";

import {
  getSellRequests,
  resetManageWithdrawls,
  updateSellRequest
} from "redux/modules/manageWithdrawls";
import routePaths from "Routes/routePaths";
import { SELLING_STATUS } from "../../../constants";
import DisplayTable from "components/DisplayTable";
import CopyData from "components/CopyData";
import Filter from "components/Filter";

import "./ManageWithdrawls.scss";

class ManageWithdrawls extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: "all",
      isUpdating: false
    };
  }

  componentDidMount() {
    this.fetchSellRequests();
  }

  componentDidUpdate(prevProps, prevState) {
    const { location } = this.props;
    const { filter } = this.state;
    if (
      prevProps.location.search !== location.search ||
      prevState.filter !== filter
    ) {
      this.fetchSellRequests();
    }
  }

  componentWillUnmount() {
    const { resetManageWithdrawls } = this.props;
    resetManageWithdrawls();
  }

  fetchSellRequests = () => {
    const { location, getSellRequests } = this.props;
    const { filter } = this.state;
    const options = {};
    options.page = location.search.split("?page=").pop() || 1;
    if (filter !== "all") {
      options["status[eq]"] = filter;
    }
    getSellRequests({ options });
  };

  columns = [
    {
      title: "Paytm Number",
      dataIndex: "phone",
      render: phone => (
        <div>
          <div>{phone}</div>
          <CopyData data={phone} title="Copy No" />
        </div>
      )
    },
    {
      title: "Amount",
      dataIndex: "amount"
    },
    {
      title: "Status",
      dataIndex: "status",
      render: status => status.toUpperCase()
    },
    {
      title: "Action",
      dataIndex: "status",
      render: (status, record) => {
        console.log(status, record);
        return status === SELLING_STATUS.completed ? (
          <div style={{ color: "#1890ff" }}>NA</div>
        ) : (
          <Button
            type="primary"
            onClick={() => {
              this.setState({ isUpdating: true });
              this.props.updateSellRequest({
                sellId: record._id,
                updateObj: { status: SELLING_STATUS.completed },
                cbSuccess: () => {
                  this.setState({ isUpdating: false });
                  this.fetchSellRequests();
                },
                cbError: () => {
                  this.setState({ isUpdating: false });
                }
              });
            }}
          >
            Mark done
          </Button>
        );
      }
    }
  ];

  render() {
    const { manageWithdrawls, history } = this.props;
    const { isLoading, sellRequests, total } = manageWithdrawls;
    return (
      <div className="ManageWithdrawl">
        Sell Requests
        <Filter
          initialValue={this.state.filter}
          onChange={value => {
            this.setState({ filter: value });
          }}
          options={{ all: "all", ...SELLING_STATUS }}
        />
        <DisplayTable
          rowKey="_id"
          dataSource={sellRequests}
          columns={this.columns}
          loading={isLoading || this.state.isUpdating}
          paginationProps={{
            total: total,
            onChange: currentPage => {
              history.push(
                `${routePaths.ADMIN.manageWithdrawls}${
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

export default connect(
  ({ manageWithdrawls }) => ({
    manageWithdrawls
  }),
  {
    getSellRequests,
    resetManageWithdrawls,
    updateSellRequest
  }
)(ManageWithdrawls);

ManageWithdrawls.propTypes = {
  getSellRequests: PropTypes.func,
  manageWithdrawls: PropTypes.object,
  resetManageWithdrawls: PropTypes.func,
  updateSellRequest: PropTypes.func,
  location: PropTypes.func,
  history: PropTypes.object
};
