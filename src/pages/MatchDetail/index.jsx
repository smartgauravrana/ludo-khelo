import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import RecordingMessage from "./RecordingMessage";
import PenaltyMessage from "./PenaltyMessage";
import NoticeBoard from "./PenaltyMessage/NoticeBoard";
import "./MatchDetail.scss";

function MatchDetail({ matchList, match }) {
  const [matchDetail, setMatchDetail] = useState(null);
  const [roomInput, setRoomInput] = useState("");
  useEffect(() => {
    const matchFound = matchList.find(
      item => item._id === match.params.matchId
    );
    setMatchDetail(matchFound);
  }, []);

  const form = (
    <div className="MatchDetail__Room">
      <div className="form__container set-challenge-block">
        <label htmlFor="inputRoomId" className="room_label">
          Enter Room Code
        </label>
        <input
          type="number"
          className="form-control"
          id="inputRoomId"
          placeholder="Enter Room Code"
          required
          value={roomInput}
          onChange={() => setRoomInput(event.target.value)}
        />
        <button
          type="submit"
          className="btn btn-primary waves-effect waves-light"
          disabled={!roomInput}
        >
          Set Room Code
        </button>
      </div>
    </div>
  );

  return matchDetail ? (
    <div className="MatchDetail">
      <NoticeBoard matchDetail={matchDetail} />
      <hr />
      {form}
      <hr />
      <RecordingMessage />
      <hr />
      <PenaltyMessage />
    </div>
  ) : (
    <div>loading....</div>
  );
}

export default connect(({ matchDetails: { matchList } }) => ({ matchList }))(
  MatchDetail
);

MatchDetail.propTypes = {
  matchList: PropTypes.array,
  match: PropTypes.object
};
