import React from "react";
import { Card, Button } from "antd";
import PropTypes from "prop-types";
import Moment from "moment";
import { connect } from "react-redux";

import { deleteMatch } from "redux/modules/matchDetails";
import { MATCH_STATUS } from "../../../constants";

import "./Match.scss";

function Match({ content, user, deleteMatch }) {
  const renderActionBtn = () => {
    if (
      content.status === MATCH_STATUS.active &&
      content.createdBy !== user._id
    ) {
      return <Button type="primary">Play</Button>;
    }
    if (content.status === MATCH_STATUS.active) {
      return (
        <Button
          type="primary"
          className="danger__btn"
          onClick={() => deleteMatch(content)}
        >
          Delete
        </Button>
      );
    }
    return null;
  };

  return (
    <div className="Match">
      <Card style={{ width: 300 }}>
        <div className="Match__createdDate">
          Created: {Moment(content.createdOn).fromNow()}
        </div>
        <div className="Match__info">
          <p>Match Amount: Rs.{content.amount}</p>

          {content.status !== MATCH_STATUS.inProgress && renderActionBtn()}
        </div>
      </Card>
    </div>
  );
}

export default connect(null, { deleteMatch })(Match);

Match.propTypes = {
  content: PropTypes.object,
  user: PropTypes.object,
  deleteMatch: PropTypes.func
};
