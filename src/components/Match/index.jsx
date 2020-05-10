import React from "react";
import { Card, Button } from "antd";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";
import Moment from "moment";
import { connect } from "react-redux";

import { deleteMatch, sendInvite } from "redux/modules/matchDetails";
import { MATCH_STATUS } from "../../../constants";
// import routePaths from "Routes/routePaths";

import "./Match.scss";

function Match({ content, user, deleteMatch, sendInvite }) {
  const history = useHistory();
  const playRequest = () => {
    sendInvite(content);
  };

  const renderActionBtn = () => {
    if (content.status === MATCH_STATUS.created) {
      if (content.createdBy._id !== user._id) {
        return (
          <Button type="primary" onClick={playRequest}>
            Play
          </Button>
        );
      } else {
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
    }
    if (content.status === MATCH_STATUS.playRequested) {
      if (content.createdBy._id === user._id) {
        return (
          <>
            <Button
              type="primary"
              className="Load_btn"
              onClick={() => history.push(`/match/${content._id}`)}
            >
              Accept
            </Button>
            <Button>Cancel</Button>
          </>
        );
      }
      if (content.joinee._id === user._id) {
        return (
          <>
            <Button type="ghost" disabled>
              Can&apos;t join
            </Button>
            <Button>Cancel</Button>
          </>
        );
      }
      return (
        <Button type="ghost" disabled>
          Can&apos;t join
        </Button>
      );
    }

    if (content.status === MATCH_STATUS.playAccepted) {
      return (
        <Button
          type="primary"
          className="Load_btn"
          onClick={() => history.push(`/match/${content._id}`)}
        >
          View
        </Button>
      );
    }
    return null;
  };

  return (
    <div className="Match">
      <Card className="Match__card">
        <div className="Match__createdDate">
          Created: {Moment(content.createdOn).fromNow()}
        </div>
        <div className="Match__info">
          <p>
            {content.createdBy.username} have set a challenge for{" "}
            <strong>&#8377;{content.amount}</strong>
          </p>
          {/* <p>Match Amount: Rs.{content.amount}</p> */}

          {content.status !== MATCH_STATUS.inProgress && renderActionBtn()}
        </div>
      </Card>
    </div>
  );
}

export default connect(null, { deleteMatch, sendInvite })(Match);

Match.propTypes = {
  content: PropTypes.object,
  user: PropTypes.object,
  deleteMatch: PropTypes.func,
  sendInvite: PropTypes.func
};
