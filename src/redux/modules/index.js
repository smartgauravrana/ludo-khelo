import { combineReducers } from "redux";
import userDetails from "./userDetails";
import matchDetails from "./matchDetails";
import timeline from "./timeline";
import manage from "./manage";
import settings from "./settings";
import dashboard from "./dashboard";
import manageWithdrawls from "./manageWithdrawls";

export default combineReducers({
  userDetails,
  matchDetails,
  timeline,
  manage,
  settings,
  dashboard,
  manageWithdrawls
});
