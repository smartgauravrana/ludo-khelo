import React from "react";
import PropTypes from "prop-types";

export default function NoticeBoard({ matchDetail }) {
  return (
    <div>
      <div className="text-danger notice-msg">
        Notice: कृपया ध्यान दे, गेम स्टार्ट होने के बाद 4-5 चान्सेस तक हर चांस
        में स्क्रीनशॉट ले | जरुरत पड़ने पर आपके काम आ सकता है |
      </div>
      <div className="challengeBetween">
        {`${matchDetail.createdBy.username} vs ${matchDetail.joinee.username} of ₹${matchDetail.amount}.`}
      </div>
      <div className="card-text text-primary notice-msg">
        Opponent Whatsapp Number -&gt; 919829545355.
      </div>
      <a
        href="https://wa.me/919829545355"
        target="_blank"
        rel="noopener noreferrer"
        className="notice-msg"
      >
        Click here to message your opponent
      </a>
    </div>
  );
}

NoticeBoard.propTypes = {
  matchDetail: PropTypes.object
};
