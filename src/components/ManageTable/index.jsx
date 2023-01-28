import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Button, Modal, message } from "antd";
import { withRouter } from "react-router-dom";

import { MATCH_STATUS, RESULT_OPTIONS } from "@/constants";
import routePaths from "@/Routes/routePaths";
import { getMatches, updateMatches } from "@/redux/modules/manage";
import { postResult } from "@/redux/modules/matchDetails";
import DisplayTable from "@/components/DisplayTable";
import CopyData from "@/components/CopyData";
import Filter from "@/components/Filter";
import "./ManageTable.scss";

class ManageTable extends Component {
  constructor() {
    super();
    this.state = {
      selectedRecord: null,
      showModal: false,
      selectedWinnerId: null,
      modalError: "",
      matchFilter: MATCH_STATUS.onHold,
    };
    this.toBeCancelled = "toBeCancelled";
  }

  componentDidMount() {
    const { getMatches, location } = this.props;
    const { matchFilter } = this.state;
    const options = {
      "status[eq]": matchFilter,
      page: location.search.split("?page=").pop() || 1,
    };
    getMatches({ options });
  }

  componentDidUpdate(prevProps, prevState) {
    const { location, getMatches } = this.props;
    const { matchFilter } = this.state;
    if (
      prevProps.location.search !== location.search ||
      prevState.matchFilter !== matchFilter
    ) {
      const options = {
        "status[eq]": matchFilter,
        page: location.search.split("?page=").pop() || 1,
      };
      getMatches({ options });
    }
  }

  columns = [
    {
      title: "Match ID",
      dataIndex: "_id",
      ellipsis: true,
      render: (_id) => (
        <div>
          <div>{_id}</div>
          <CopyData data={_id} title="Copy Match ID" />
        </div>
      ),
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
      },
    },
    {
      title: "Status",
      dataIndex: "status",
    },
    {
      title: "Proof",
      dataIndex: "resultsPosted",
      render: (results, record) => {
        const { createdBy, joinee } = record;
        return Object.keys(results).map((resultType) => (
          <>
            <div>
              <strong>{resultType}:</strong>
            </div>
            <ul key={resultType}>
              {results[resultType].map((result) => (
                <li key={result.postedBy}>
                  {result.postedBy === createdBy._id
                    ? createdBy.username
                    : joinee && joinee.username}
                  {result.imgUrl && (
                    <a
                      href={result.imgUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={result.imgUrl}
                        style={{ height: "40px", width: "40px" }}
                      />
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </>
        ));
      },
    },
    {
      title: "Action",
      dataIndex: "resultsPosted",
      render: (results, record) => {
        return record.status === MATCH_STATUS.onHold ? (
          <Button
            type="primary"
            onClick={() => {
              this.setState({ selectedRecord: record });
              this.setState({ showModal: true });
            }}
          >
            Resolve
          </Button>
        ) : (
          <div style={{ color: "#1890ff" }}>NA</div>
        );
      },
    },
  ];

  closeModal = () =>
    this.setState({
      showModal: false,
    });

  afterClose = () =>
    this.setState({
      selectedRecord: null,
      selectedWinnerId: null,
      modalError: "",
    });

  selectWinner = (id) => this.setState({ selectedWinnerId: id });

  cancelMatch = () => this.setState({ toBeCancelled: true });

  onOkHandler = () => {
    const { selectedRecord, selectedWinnerId } = this.state;
    if (!selectedWinnerId) {
      this.setState({ modalError: "Choose any winner!" });
    }
    this.setState({ modalError: "" });
    this.props.postResult(
      {
        matchId: selectedRecord._id,
        winner:
          selectedWinnerId !== this.toBeCancelled ? selectedWinnerId : null,
        resultType:
          selectedWinnerId === this.toBeCancelled
            ? RESULT_OPTIONS.cancel
            : "completed",
      },
      (data) => {
        this.setState({ showModal: false });
        this.props.updateMatches(data);
        message.success("Action completed");
      },
      (err) => {
        const { data } = err.response;
        message.error(data.error);
      }
    );
  };

  render() {
    const { matches, isMatchesLoading, total, history, location } = this.props;
    const {
      selectedRecord,
      showModal,
      modalError,
      selectedWinnerId,
      toBeCancelled,
    } = this.state;
    return (
      <div className="ManageTable">
        <Filter
          initialValue={this.state.matchFilter}
          onChange={(value) => {
            this.setState({ matchFilter: value });
          }}
        />
        <DisplayTable
          rowKey="_id"
          dataSource={matches}
          columns={this.columns}
          loading={isMatchesLoading}
          location={location}
          paginationProps={{
            total: total,
            onChange: (currentPage) => {
              history.push(
                `${routePaths.ADMIN.manage}${
                  currentPage !== 1 ? "?page=" + currentPage : ""
                }`
              );
            },
          }}
        />
        <Modal
          visible={showModal}
          onOk={this.onOkHandler}
          onCancel={this.closeModal}
          title="Select Winner"
          afterClose={this.afterClose}
        >
          <div className="winner-choose">
            <div className="winner-choice">
              <input
                type="radio"
                name="winnerId"
                value={selectedRecord && selectedRecord.createdBy._id}
                onChange={() => this.selectWinner(selectedRecord.createdBy._id)}
                checked={
                  selectedWinnerId ===
                  (selectedRecord && selectedRecord.createdBy._id)
                }
              />
              <label>
                {selectedRecord && selectedRecord.createdBy.username}
              </label>
            </div>
            <div className="winner-choice">
              <input
                type="radio"
                name="winnerId"
                value={
                  selectedRecord &&
                  selectedRecord.joinee &&
                  selectedRecord.joinee._id
                }
                onChange={() => this.selectWinner(selectedRecord.joinee._id)}
                checked={
                  selectedWinnerId ===
                  (selectedRecord &&
                    selectedRecord.joinee &&
                    selectedRecord.joinee._id)
                }
              />
              <label>
                {selectedRecord &&
                  selectedRecord.joinee &&
                  selectedRecord.joinee.username}
              </label>
            </div>
            <br />
            <hr />
            <br />
            <strong>
              <p>Or do you want to cancel?</p>
            </strong>
            <div className="winner-choice">
              <input
                type="radio"
                name="winnerId"
                value="cancel"
                onChange={() => this.selectWinner(this.toBeCancelled)}
                checked={selectedWinnerId == this.toBeCancelled}
              />
              <label>Cancel Match</label>
            </div>
          </div>
          {modalError && <div className="text-danger">{modalError}</div>}
        </Modal>
      </div>
    );
  }
}

export default withRouter(
  connect(
    ({ manage: { matches, isMatchesLoading, total } }) => ({
      matches,
      isMatchesLoading,
      total,
    }),
    {
      getMatches,
      postResult,
      updateMatches,
    }
  )(ManageTable)
);

ManageTable.propTypes = {
  matches: PropTypes.array,
  total: PropTypes.number,
  isMatchesLoading: PropTypes.bool,
  getMatches: PropTypes.func,
  postResult: PropTypes.func,
  updateMatches: PropTypes.func,
  location: PropTypes.object,
  history: PropTypes.object,
};
