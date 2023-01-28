import React, { useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import Match from "@/components/Match";
import {
  getAllMatches,
  resetMatches,
  updateMatchStatus,
  getMatch,
  removeMatch,
} from "@/redux/modules/matchDetails";
import SocketContext from "@/context/socket-context";
import ListingWithInfiniteScroll from "@/components/ListingWithInfiniteScroll";
import { SOCKET_EVENTS } from "@/constants";
import "./Matches.scss";

function Matches({
  getAllMatches,
  matchList,
  userDetails,
  resetMatches,
  updateMatchStatus,
  getMatch,
  socket,
  removeMatch,
  hasMore,
  isLoading,
}) {
  useEffect(() => {
    socket.on(SOCKET_EVENTS.serverPlayRequested, (data) => {
      console.log("play requested for my match");
      getMatch(data.matchId);
    });

    socket.on(SOCKET_EVENTS.serverPlayAccepted, (data) => {
      console.log("play accepted for my match: ", getMatch);
      getMatch(data.matchId);
    });
    socket.on(SOCKET_EVENTS.serverMatchDeleted, (data) => {
      console.log("Match deleted with id ", data.matchId);
      removeMatch(data.matchId);
    });
    return () => {
      resetMatches();
      socket.removeAllListeners(SOCKET_EVENTS.serverPlayRequested);
      socket.removeAllListeners(SOCKET_EVENTS.serverPlayAccepted);
    };
  }, []);
  return (
    <div className="Matches">
      <div className="Matches__heading">
        Recently Created Matches {userDetails.isAdmin && "by Admin"}
      </div>
      <div className="Matches__list">
        <ListingWithInfiniteScroll
          hasMore={hasMore && !isLoading}
          isLoading={isLoading}
          loadMore={() => getAllMatches()}
          settings={{ initialLoad: true }}
        >
          {matchList.map((match) => (
            <Match
              key={match._id}
              content={match}
              user={userDetails}
              socket={socket}
            />
          ))}
        </ListingWithInfiniteScroll>
      </div>
    </div>
  );
}

const MatchesWithSocket = (props) => (
  <SocketContext.Consumer>
    {(socket) => <Matches {...props} socket={socket} />}
  </SocketContext.Consumer>
);

export default connect(
  ({ matchDetails: { matchList, hasMore, isLoading }, userDetails }) => ({
    matchList,
    userDetails,
    hasMore,
    isLoading,
  }),
  {
    getAllMatches,
    resetMatches,
    updateMatchStatus,
    getMatch,
    removeMatch,
  }
)(MatchesWithSocket);

Matches.propTypes = {
  matchList: PropTypes.array,
  getAllMatches: PropTypes.func,
  userDetails: PropTypes.object,
  resetMatches: PropTypes.func,
  socket: PropTypes.object,
  updateMatchStatus: PropTypes.func,
  getMatch: PropTypes.func,
  removeMatch: PropTypes.func,
  hasMore: PropTypes.bool,
  isLoading: PropTypes.bool,
};
