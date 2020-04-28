import React from "react";

import CustomTitle from "components/CustomTitle";
import "./Buy.scss";

export default function Buy() {
  return (
    <div className="Buy">
      <div className="Buy__Header">
        <CustomTitle title="Buy Chips" />
        <p style={{ color: "indigo", fontSize: "19px" }}>
          Pay via Paytm Wallet Only
        </p>
        <p className="text-danger" style={{ fontSize: "19px" }}>
          Dont pay through Bank (You will lose your money).
        </p>
        <p>
          Please pay at this number only{" "}
          <span>
            <b style={{ fontSize: "120%", color: "red" }}>9729343885</b>
          </span>
          , and enter wallet Transcation Id.
          <br />
          <a href="/help/loadbalance">Help</a>
        </p>
      </div>
    </div>
  );
}
