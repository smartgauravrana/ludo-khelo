import React from "react";

export default function RecordingMessage() {
  return (
    <div className="challengeBetween" style={{ color: "red" }}>
      <h6 className="card-text text-warning notice-msg">
        Use{" "}
        <a href="https://play.google.com/store/apps/details?id=com.hecorat.screenrecorder.free">
          AZ Recorder
        </a>{" "}
        App to record game.
      </h6>
      <div className="card-text text-danger notice-msg">
        For cancelling game,{" "}
        <b>
          <u>VIDEO PROOF</u>
        </b>{" "}
        is necessary otherwise game will not be cancelled.
      </div>
    </div>
  );
}
