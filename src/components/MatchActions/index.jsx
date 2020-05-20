import React from "react";
import PropTypes from "prop-types";
import { Button } from "antd";
import { useHistory } from "react-router-dom";

import { MATCH_STATUS } from "../../../constants";
import { isResultPosted } from "client-utils";

export default function MatchActions({
  content,
  playRequest,
  cancelRequest,
  deleteMatch,
  user
}) {
  const history = useHistory();
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
            Requested
          </Button>
          <Button onClick={cancelRequest}>Cancel</Button>
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
  if (content.status === MATCH_STATUS.onHold) {
    // checking if result posted by user or not
    if (!isResultPosted(content.resultsPosted, user._id)) {
      return (
        <Button
          type="primary"
          className="Load_btn"
          onClick={() => history.push(`/match/${content._id}`)}
        >
          View
        </Button>
      );
    } else {
      return (
        <Button type="ghost" disabled>
          Processing
        </Button>
      );
    }
  }
  return null;
}

MatchActions.propTypes = {
  content: PropTypes.object,
  playRequest: PropTypes.func,
  cancelRequest: PropTypes.func,
  user: PropTypes.object,
  deleteMatch: PropTypes.func
};
