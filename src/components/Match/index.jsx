import React from "react";
import { Card } from "antd";
import PropTypes from "prop-types";
import Moment from "moment";

import "./Match.scss";

export default function Match({ content }) {
  return (
    <div className="Match">
      <Card style={{ width: 300 }}>
        <div className="Match__createdDate">
          Created: {Moment(content.createdOn).fromNow()}
        </div>
        <p className="Match__info">Match Amount: Rs.{content.amount}</p>
      </Card>
    </div>
  );
}

Match.propTypes = {
  content: PropTypes.object
};
