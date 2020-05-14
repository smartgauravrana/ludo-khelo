import { combineReducers } from "redux";
import userDetails from "./userDetails";
import matchDetails from "./matchDetails";
import timeline from "./timeline";

export default combineReducers({
  userDetails,
  matchDetails,
  timeline
});
