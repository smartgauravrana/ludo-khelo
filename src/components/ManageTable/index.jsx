import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Button, Modal } from "antd";

import { getMatches } from "redux/modules/manage";
import DisplayTable from "components/DisplayTable";
import "./ManageTable.scss";

class ManageTable extends Component {
  constructor() {
    super();
    this.state = {
      selectedRecord: null,
      showModal: false,
      selectedWinnerId: null,
      modalError: ""
    };
  }

  componentDidMount() {
    this.props.getMatches({});
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
    if (!this.state.selectedWinnerId) {
      this.setState({ modalError: "Choose any winner!" });
    }
    this.setState({ modalError: "" });
    console.log(this.state.selectedWinnerId);
  };

  render() {
    const { matches, isMatchesLoading, total } = this.props;
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
            total: total
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

export default connect(
  ({ manage: { matches, isMatchesLoading, total } }) => ({
    matches,
    isMatchesLoading,
    total
  }),
  {
    getMatches
  }
)(ManageTable);

ManageTable.propTypes = {
  matches: PropTypes.array,
  total: PropTypes.number,
  isMatchesLoading: PropTypes.bool,
  getMatches: PropTypes.func
};
