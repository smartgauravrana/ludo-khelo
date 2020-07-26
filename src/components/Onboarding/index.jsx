import React from "react";
import { Link } from "react-router-dom";

import routePaths from "Routes/routePaths";
import QueryNotice from "components/QueryNotice";
import "./Onboarding.scss";

export default function Onboarding() {
  return (
    <div class="Onboarding">
      <h3 className="Onboarding__Earn">Win ₹20000 daily.</h3>
      <p className="Onboarding__EarnInfo">
        You can win more than ₹20000 daily by just playing Ludo.
      </p>
      <p style={{ textAlign: "center" }}></p>
      <div className="Onboarding__Login">
        Please <Link to={routePaths.LOGIN}>login</Link> to play now.
      </div>
      <p style={{ textAign: "center" }}></p>
      <div className="Onboarding__Register">
        Don't have a account, <Link to={routePaths.REGISTER}>register</Link> to
        play now.
      </div>
      <p></p>
      <p>For any help, watch this video</p>
      <div>
        <iframe
          src="https://www.youtube.com/embed/O7dAJRo-Swg"
          frameborder="0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
      </div>

      <QueryNotice />
    </div>
  );
}
