import React, { useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { getTimeline } from "redux/modules/timeline";
import "./Timeline.scss";

function Timeline({ timeline, getTimeline }) {
  useEffect(() => {
    getTimeline(data => console.log("timeline: ", data));
  }, []);
  return <div>Timleine</div>;
}

export default connect(({ timeline }) => ({ timeline }), {
  getTimeline
})(Timeline);

Timeline.propTypes = {
  timeline: PropTypes.array,
  getTimeline: PropTypes.func
};
