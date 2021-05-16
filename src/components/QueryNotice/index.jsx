import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import telegramIcon from "assets/telegram_icon.png";
import whatsappIcon from "assets/whatsapp_icon.png";

import "./QueryNotice.scss";

function QueryNotice({ settings, userDetails }) {
  const { supportNumber, telegramEnabled, telegramUsername, whatsappEnabled } = settings;
  return (
    <div className="QueryNotice">
      <h3 style={{ textAlign: "center" }}>For Any Query</h3>
      {telegramEnabled && (
        <>
        <a 
          href={`https://t.me/${telegramUsername}`}
          target="_blank"
          rel="noopener noreferrer"
          className="QueryNotice__Support">Click here to contact Admin <img src={telegramIcon}/></a>
          <br />
        </>) } 
      {whatsappEnabled && <p style={{ textAlign: "center" }}>
        {`Please contact support at whatsapp (+91${supportNumber})`}
      </p>}
      Your query will be solved in <b>within 12 hours</b>. <br />
      {whatsappEnabled && <a
        href={`https://wa.me/91${supportNumber}?text=Please+Load+Chips+In+My+Account,+My+account+number+is+${userDetails.phone}`}
        target="_blank"
        rel="noopener noreferrer"
        className="QueryNotice__Support"
      >
        Click here to contact Admin <img src={whatsappIcon}/>
      </a>}
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
