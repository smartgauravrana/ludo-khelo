import React, { useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import Match from "components/Match";
import { getAllMatches } from "redux/modules/matchDetails";
import "./Matches.scss";

function Matches({ getAllMatches, matchList, isAdmin }) {
  useEffect(() => {
    getAllMatches();
  }, []);
  return (
    <div className="Matches">
      <div className="Matches__heading">
        Recently Created Matches {isAdmin && "by Admin"}
      </div>
      <div className="Matches__list">
        {matchList.map(match => (
          <Match key={match._id} content={match} />
        ))}
      </div>
    </div>
  );
}

export default connect(
  ({ matchDetails: { matchList }, userDetails: { isAdmin } }) => ({
    matchList
  }),
  {
    getAllMatches
  }
)(Matches);

Matches.propTypes = {
  matchList: PropTypes.array,
  getAllMatches: PropTypes.func,
  isAdmin: PropTypes.bool
};
