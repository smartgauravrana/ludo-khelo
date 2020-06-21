import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { message } from "antd";
import { useHistory } from "react-router-dom";

import { postResult } from "redux/modules/matchDetails";
import { checkLogin } from "redux/modules/userDetails";
import Loader from "components/Loader";
import routePaths from "Routes/routePaths";
import { storage } from "../../../firebase";
import { RESULT_OPTIONS } from "../../../../constants";
import { isParticipant } from "client-utils";
import "./PostResult.scss";

const resultOptions = [
  {
    value: RESULT_OPTIONS.won,
    label: "I Won"
  },
  {
    value: RESULT_OPTIONS.lost,
    label: "I Lost"
  },
  {
    value: RESULT_OPTIONS.cancel,
    label: "Cancel Game"
  }
];

function PostResult({ postResult, checkLogin, matchDetail, user }) {
  const matchId = matchDetail && matchDetail._id;
  const [choice, setChoice] = useState("");
  const [cancelText, setCancelText] = useState("");
  const [imageAsFile, setImageAsFile] = useState("");
  const [imageAsUrl, setImageAsUrl] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const history = useHistory();

  const onPostResult = () => {
    if (!isParticipant(matchDetail, user._id)) {
      return message.error("You're not allowed for this!");
    }
    setIsLoading(true);
    let postData = { resultType: choice, matchId };
    switch (choice) {
      case RESULT_OPTIONS.won:
        postData = { ...postData, imgUrl: imageAsUrl.imgUrl };
        break;
      case RESULT_OPTIONS.cancel:
        postData = { ...postData, cancelReason: cancelText };
        break;
    }
    postResult(
      postData,
      () => {
        setIsLoading(false);
        checkLogin();
        history.push(routePaths.HOME);
      },
      err => {
        setIsLoading(false);
        const { data } = err.response;
        message.error(data.error);
      }
    );
  };

  const cancelReason = (
    <div id="cancelReasonBlock">
      <br />
      <div className="form-group">
        <label htmlFor="cancelReason">Cancel Reason</label>
        <textarea
          name="cancelReason"
          className="form-control"
          id="cancelReason"
          rows="2"
          maxLength="50"
          required
          value={cancelText}
          onChange={() => setCancelText(event.target.value)}
        ></textarea>
      </div>
      <br />

      <div className="challengeBetween">
        <h6 className="card-text text-info">
          Mention if you have VIDEO PROOF and send it on whatsapp at 8823870386
        </h6>
        <a
          href="https://wa.me/919729343885"
          target="_blank"
          rel="noopener noreferrer"
        >
          Click Here to send Video.
        </a>
      </div>
    </div>
  );

  const handleImageAsFile = e => {
    const image = e.target.files[0];
    setImageAsFile(imageFile => image);
    handleFireBaseUpload(image);
  };
  const handleFireBaseUpload = imageAsFile => {
    console.log("start of upload");
    // async magic goes here...
    if (imageAsFile === "") {
      console.error(`not an image, the image file is a ${typeof imageAsFile}`);
    }
    setIsLoading(true);
    const uploadTask = storage
      .ref(`/images/${imageAsFile.name}`)
      .put(imageAsFile);
    // initiates the firebase side uploading
    uploadTask.on(
      "state_changed",
      snapShot => {
        // takes a snap shot of the process as it is happening
        console.log(snapShot);
      },
      err => {
        // catches the errors
        console.log(err);
      },
      () => {
        // gets the functions from storage refences the image storage in firebase by the children
        // gets the download url then sets the image from firebase as the value for the imgUrl key:
        storage
          .ref("images")
          .child(imageAsFile.name)
          .getDownloadURL()
          .then(fireBaseUrl => {
            setIsLoading(false);
            setImageAsUrl(prevObject => ({
              ...prevObject,
              imgUrl: fireBaseUrl
            }));
          });
      }
    );
  };

  const screenshotBlock = (
    <div id="screenShotBlock">
      <br />
      <label>Winning Screen Shot</label>
      <div className="custom-file">
        <input
          type="file"
          className="custom-file-input"
          id="screenShot"
          accept=".png, .jpg, .jpeg"
          required
          onChange={handleImageAsFile}
        />
        <label className="custom-file-label" htmlFor="screenShot">
          Upload
        </label>
      </div>
      <br />
      <br />
      <div className="screenShot-upload">
        {imageAsUrl.imgUrl && (
          <img
            className="img-fluid"
            alt="Responsive image"
            src={imageAsUrl && imageAsUrl.imgUrl}
          />
        )}
        <br />
      </div>
    </div>
  );

  return (
    <div className="PostResult">
      {isLoading && <Loader />}
      <h2>POST RESULT</h2>
      <div className="PostResult__select">
        {resultOptions.map(option => (
          <div
            className={`PostResult__item ${
              option.value === choice ? "PostResult__item--selected" : ""
            }`}
            key={option.value}
          >
            <input
              type="radio"
              id={option.value}
              onChange={() => setChoice(option.value)}
              checked={option.value === choice}
            />
            <label htmlFor={option.value}>{option.label}</label>
          </div>
        ))}
        {choice === RESULT_OPTIONS.cancel && cancelReason}
        {choice === RESULT_OPTIONS.won && screenshotBlock}
      </div>
      <button
        className="PostResult__Button"
        disabled={
          !choice || (choice === RESULT_OPTIONS.won && !imageAsUrl.imgUrl)
        }
        onClick={() => {
          if (choice === RESULT_OPTIONS.cancel && !cancelText) {
            return message.error("Enter Cancel Reason!");
          }
          onPostResult();
        }}
      >
        Post Result
      </button>
    </div>
  );
}

export default connect(null, {
  postResult,
  checkLogin
})(PostResult);

PostResult.propTypes = {
  postResult: PropTypes.func,
  checkLogin: PropTypes.func,
  matchDetail: PropTypes.string,
  user: PropTypes.object
};
