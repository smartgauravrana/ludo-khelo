import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import HistoryTable from "@/components/HistoryTable";
import { getTimeline } from "@/redux/modules/timeline";
import "./Timeline.scss";

function Timeline({ timeline, getTimeline }) {
  return (
    <div className="Timeline">
      <HistoryTable />
    </div>
  );
}

export default connect(({ timeline }) => ({ timeline }), {
  getTimeline,
})(Timeline);

Timeline.propTypes = {
  timeline: PropTypes.array,
  getTimeline: PropTypes.func,
};
