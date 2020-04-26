import { combineReducers } from "redux";
import userDetails from "./userDetails";
import matchDetails from "./matchDetails";

export default combineReducers({
  userDetails,
  matchDetails
});
