import { combineReducers } from "redux";
import userDetails from "./userDetails";
import matchDetails from "./matchDetails";
import timeline from "./timeline";
import manage from "./manage";
import settings from "./settings";

export default combineReducers({
  userDetails,
  matchDetails,
  timeline,
  manage,
  settings
});
