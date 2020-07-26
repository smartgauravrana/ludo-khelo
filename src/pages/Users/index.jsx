import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Button, Modal } from "antd";

import { getAllUsers, addChips, resetUsers } from "redux/modules/users";
import routePaths from "Routes/routePaths";
import DisplayTable from "components/DisplayTable";
import SearchInput from "components/SearchInput";
import Loader from "components/Loader";
import "./Users.scss";

class Users extends Component {
  constructor() {
    super();
    this.state = {
      selectedUser: null,
      phone: null,
      showModal: false,
      chips: 0,
      updatingUser: false
    };
  }

  componentDidMount() {
    this.fetchAllUsers();
  }

  componentDidUpdate(prevProps, prevState) {
    const { location } = this.props;
    if (prevProps.location.search !== location.search) {
      this.fetchAllUsers();
    }
  }

  componentWillUnmount() {
    const { resetUsers } = this.props;
    resetUsers();
  }

  fetchAllUsers = () => {
    const { location, getAllUsers } = this.props;
    const { phone } = this.state;
    const options = {};
    options.page = location.search.split("?page=").pop() || 1;
    if (phone) options.phone = phone;
    getAllUsers(options);
  };

  columns = [
    {
      title: "Phone",
      dataIndex: "phone",
      render: (phone, record) => (
        <div
          onClick={() =>
            this.setState({ selectedUser: record, showModal: true })
          }
        >
          <a>{phone}</a>
        </div>
      )
    },
    {
      title: "Username",
      dataIndex: "username",
      ellipsis: true
    },
    {
      title: "Chips",
      dataIndex: "chips"
    }
  ];

  handleChipsInput = e => this.setState({ chips: e.target.value });

  closeModal = () =>
    this.setState({
      showModal: false,
      selectedUser: null,
      updatingUser: false
    });

  render() {
    const { users, history, getAllUsers, addChips } = this.props;
    const { selectedUser, showModal, chips, updatingUser } = this.state;
    const { usersList, total, isUsersLoading } = users;
    return (
      <div className="Users">
        <h1>Manage Users</h1>
        <SearchInput
          placeholder="Search by phone"
          onClick={val => {
            let options = {};
            if (val) options.phone = val;
            getAllUsers(options);
          }}
        />
        <DisplayTable
          rowKey="_id"
          dataSource={usersList}
          columns={this.columns}
          loading={isUsersLoading}
          paginationProps={{
            total: total,
            onChange: currentPage => {
              history.push(
                `${routePaths.ADMIN.users}${
                  currentPage !== 1 ? "?page=" + currentPage : ""
                }`
              );
            }
          }}
        />
        {selectedUser && (
          <Modal
            visible={showModal}
            onOk={this.closeModal}
            onCancel={this.closeModal}
            title="Enter chips to add"
            afterClose={this.afterClose}
          >
            <div className="Users__info">
              Username: {selectedUser.username} ({selectedUser.phone})
            </div>
            <div className="Users__info">
              Current Chips: {selectedUser.chips}
            </div>

            <div className="Users__Addchips">
              <div className="form-control form-group">
                <input
                  type="number"
                  placeholder="Enter chips"
                  onChange={this.handleChipsInput}
                />
              </div>
              <Button
                type="primary"
                disabled={!chips}
                onClick={() => {
                  this.setState({ updatingUser: true });
                  addChips(
                    { userId: selectedUser._id, chips },
                    this.closeModal,
                    this.closeModal
                  );
                }}
              >
                Add
              </Button>
            </div>
            {updatingUser && <Loader />}
            {/* {modalError && <div className="text-danger">{modalError}</div>} */}
          </Modal>
        )}
      </div>
    );
  }
}

export default connect(({ users }) => ({ users }), {
  getAllUsers,
  addChips,
  resetUsers
})(Users);
