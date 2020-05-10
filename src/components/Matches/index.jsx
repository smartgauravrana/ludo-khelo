import React, { useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import Match from "components/Match";
import { getAllMatches, resetMatches } from "redux/modules/matchDetails";
import "./Matches.scss";

function Matches({ getAllMatches, matchList, userDetails, resetMatches }) {
  useEffect(() => {
    getAllMatches();
    return () => {
      // resetMatches();
    };
  }, []);
  return (
    <div className="Matches">
      <div className="Matches__heading">
        Recently Created Matches {userDetails.isAdmin && "by Admin"}
      </div>
      <div className="Matches__list">
        {matchList.map(match => (
          <Match key={match._id} content={match} user={userDetails} />
        ))}
      </div>
    </div>
  );
}

export default connect(
  ({ matchDetails: { matchList }, userDetails }) => ({
    matchList,
    userDetails
  }),
  {
    getAllMatches,
    resetMatches
  }
)(Matches);

Matches.propTypes = {
  matchList: PropTypes.array,
  getAllMatches: PropTypes.func,
  userDetails: PropTypes.object,
  resetMatches: PropTypes.func
};
