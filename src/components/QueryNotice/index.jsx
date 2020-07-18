import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import "./QueryNotice.scss";

function QueryNotice({ settings, userDetails }) {
  const { supportNumber } = settings;
  return (
    <div className="QueryNotice">
      <h3 style={{ textAlign: "center" }}>For Any Query</h3>
      <p style={{ textAlign: "center" }}>
        {`Please contact support at whatsapp (+91${supportNumber})`}
        <br />
        Your query will be solved in <b>within 12 hours</b>.
      </p>
      <a
        href={`https://wa.me/91${supportNumber}?text=Please+Load+Chips+In+My+Account,+My+account+number+is+${userDetails.phone}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        Click here to contact Admin
      </a>
    </div>
  );
}

export default connect(({ userDetails, settings: { settings } }) => ({
  settings,
  userDetails
}))(QueryNotice);

QueryNotice.propTypes = {
  settings: PropTypes.object,
  userDetails: PropTypes.object
};
