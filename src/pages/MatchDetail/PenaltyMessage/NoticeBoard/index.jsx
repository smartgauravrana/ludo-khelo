import React from "react";
import PropTypes from "prop-types";

export default function NoticeBoard({ matchDetail }) {
  return (
    <div>
      <small className="text-danger">
        Notice: कृपया ध्यान दे, गेम स्टार्ट होने के बाद 4-5 चान्सेस तक हर चांस
        में स्क्रीनशॉट ले | जरुरत पड़ने पर आपके काम आ सकता है |
      </small>
      <br />
      <br />
      <div className="challengeBetween">
        {`${matchDetail.createdBy.username} vs ${matchDetail.joinee.username} of ₹${matchDetail.amount}.`}
      </div>
      <br />
      <h6 className="card-text text-primary">
        Opponent Whatsapp Number -&gt; 919829545355.
      </h6>
      <a
        href="https://wa.me/919829545355"
        target="_blank"
        rel="noopener noreferrer"
      >
        Click here to message your opponent
      </a>
      <br />
    </div>
  );
}

NoticeBoard.propTypes = {
  matchDetail: PropTypes.object
};
