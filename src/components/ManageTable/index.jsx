import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Button, Modal, message } from "antd";
import { withRouter } from "react-router-dom";

import { MATCH_STATUS } from "../../../constants";
import routePaths from "Routes/routePaths";
import { getMatches, updateMatches } from "redux/modules/manage";
import { postResult } from "redux/modules/matchDetails";
import DisplayTable from "components/DisplayTable";
import "./ManageTable.scss";

class ManageTable extends Component {
  constructor() {
    super();
    this.state = {
      selectedRecord: null,
      showModal: false,
      selectedWinnerId: null,
      modalError: "",
      matchFilter: MATCH_STATUS.onHold
    };
  }

  componentDidMount() {
    const { getMatches, location } = this.props;
    const { matchFilter } = this.state;
    const options = {
      matchStatus: matchFilter,
      page: location.search.split("?page=").pop() || 1
    };
    getMatches({ options });
  }

  componentDidUpdate(prevProps) {
    const { location, getMatches } = this.props;
    const { matchFilter } = this.state;
    if (prevProps.location.search !== location.search) {
      const options = {
        matchStatus: matchFilter,
        page: location.search.split("?page=").pop() || 1
      };
      getMatches({ options });
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
      title: "Proof",
      dataIndex: "resultsPosted",
      render: (results, record) => {
        const { createdBy, joinee } = record;
        return Object.keys(results).map(resultType => (
          <>
            <div>
              <strong>{resultType}:</strong>
            </div>
            <ul key={resultType}>
              {results[resultType].map(result => (
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
      }
    },
    {
      title: "Action",
      dataIndex: "resultsPosted",
      render: (results, record) => {
        return (
          <Button
            type="primary"
            onClick={() => {
              this.setState({ selectedRecord: record });
              this.setState({ showModal: true });
            }}
          >
            Resolve
          </Button>
        );
      }
    }
  ];

  closeModal = () =>
    this.setState({
      showModal: false
    });

  afterClose = () =>
    this.setState({
      selectedRecord: null,
      selectedWinnerId: null,
      modalError: ""
    });

  selectWinner = id => this.setState({ selectedWinnerId: id });

  onOkHandler = () => {
    const { selectedRecord, selectedWinnerId } = this.state;
    if (!selectedWinnerId) {
      this.setState({ modalError: "Choose any winner!" });
    }
    this.setState({ modalError: "" });
    this.props.postResult(
      {
        matchId: selectedRecord._id,
        winner: selectedWinnerId,
        resultType: "completed"
      },
      data => {
        this.setState({ showModal: false });
        this.props.updateMatches(data);
        message.success("Action completed");
      },
      err => {
        const { data } = err.response;
        message.error(data.msg);
      }
    );
  };

  render() {
    const { matches, isMatchesLoading, total, history } = this.props;
    const {
      selectedRecord,
      showModal,
      modalError,
      selectedWinnerId
    } = this.state;
    return (
      <div className="ManageTable">
        <DisplayTable
          rowKey="_id"
          dataSource={matches}
          columns={this.columns}
          loading={isMatchesLoading}
          paginationProps={{
            total: total,
            onChange: currentPage => {
              history.push(
                `${routePaths.ADMIN.manage}${
                  currentPage !== 1 ? "?page=" + currentPage : ""
                }`
              );
            }
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
      total
    }),
    {
      getMatches,
      postResult,
      updateMatches
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
  history: PropTypes.object
};
