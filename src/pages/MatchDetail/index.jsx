import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import SocketContext from "context/socket-context";
import { SOCKET_EVENTS, MATCH_STATUS } from "../../../constants";
import { acceptInvite, getMatch } from "redux/modules/matchDetails";
import RecordingMessage from "./RecordingMessage";
import PenaltyMessage from "./PenaltyMessage";
import NoticeBoard from "./NoticeBoard";
import PostResult from "./PostResult";
import "./MatchDetail.scss";
import { getOpponent, isResultPosted } from "client-utils";

function MatchDetail({
  matchList,
  match,
  acceptInvite,
  socket,
  userDetails,
  getMatch
}) {
  const [matchDetail, setMatchDetail] = useState(null);
  const [roomInput, setRoomInput] = useState("");
  useEffect(() => {
    getMatch(match.params.matchId, data => setMatchDetail(data));
  }, []);

  function copy() {
    var copyText = document.querySelector("#roomId");
    copyText.select();
    document.execCommand("copy");
  }
  const onRoomSubmit = () => {
    acceptInvite({ match: matchDetail, roomId: roomInput }, () => {
      socket.emit(SOCKET_EVENTS.clientPlayAccepted, {
        matchId: match.params.matchId
      });
    });
  };

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
          className="btn btn-primary waves-effect waves-light"
          disabled={!roomInput}
          onClick={() => onRoomSubmit()}
        >
          Set Room Code
        </button>
      </div>
    </div>
  );

  const roomIdDetails = (
    <div className="MatchDetail__Room">
      <div className="MatchDetail__Room--info">
        <input
          id="roomId"
          type="number"
          name="roomId"
          readOnly
          value={matchDetail && matchDetail.roomId}
        />
        <div className="input-group-append">
          <button id="copyButton" onClick={copy}>
            Copy
          </button>
        </div>
      </div>
    </div>
  );

  return matchDetail ? (
    <div className="MatchDetail">
      <NoticeBoard
        matchDetail={matchDetail}
        opponent={getOpponent(matchDetail, userDetails._id)}
      />
      <hr />
      {matchDetail.roomId ? roomIdDetails : form}
      <hr />
      <RecordingMessage />
      <hr />
      <PenaltyMessage />
      <hr />
      {matchDetail.status !== MATCH_STATUS.completed &&
        !isResultPosted(matchDetail.resultsPosted, userDetails._id) && (
          <PostResult matchDetail={matchDetail} user={userDetails} />
        )}
    </div>
  ) : (
    <div>loading....</div>
  );
}

const MatchDetailWithSocket = props => (
  <SocketContext.Consumer>
    {socket => <MatchDetail {...props} socket={socket} />}
  </SocketContext.Consumer>
);

export default connect(
  ({ matchDetails: { matchList }, userDetails }) => ({
    matchList,
    userDetails
  }),
  {
    acceptInvite,
    getMatch
  }
)(MatchDetailWithSocket);

MatchDetail.propTypes = {
  matchList: PropTypes.array,
  match: PropTypes.object,
  acceptInvite: PropTypes.func,
  socket: PropTypes.object,
  userDetails: PropTypes.object,
  getMatch: PropTypes.func
};
