import call from "api/apiRequest";
import endpoints from "api/endpoints";
import { setUserDetails } from "./userDetails";

const SET_MATCH_DETAILS = "matchDetails/SET_MATCH_DETAILS";
const SET_MATCH_LIST = "matchDetails/SET_MATCH_LIST";
const ADD_MATCH = "matchDetails/ADD_MATCH";
const DELETE_MATCH = "matchDetails/DELETE_MATCH";
const RESET_MATCHES = "matchDetails/RESET_MATCHES";

const initialState = {
  matchList: []
};

export const postMatch = (match, cbSuccess, cbError) => async (
  dispatch,
  getState
) => {
  try {
    const res = await call({
      method: "post",
      url: endpoints.matches,
      data: match
    });
    const { data } = res;
    cbSuccess && cbSuccess(data);
    const { userDetails } = getState();
    dispatch({ type: SET_MATCH_DETAILS, payload: data });
    dispatch(
      setUserDetails({
        ...userDetails,
        chips: userDetails.chips - match.amount
      })
    );
  } catch (e) {
    console.log("post match err");
    cbError && cbError(e);
  }
};

export const getAllMatches = (cbSuccess, cbError) => async (
  dispatch,
  getState
) => {
  const {
    userDetails: { isAdmin }
  } = getState();
  const params = {};
  if (isAdmin) {
    params.isOfficial = true;
  }
  try {
    const res = await call({
      url: `${endpoints.matches}`,
      params
    });
    const { data } = res;
    cbSuccess && cbSuccess(data);
    dispatch({ type: SET_MATCH_LIST, payload: data });
  } catch (e) {
    console.log("post match err");
    cbError && cbError(e);
  }
};

export const addMatch = match => {
  return { type: ADD_MATCH, payload: match };
};

export const deleteMatch = (match, cbSuccess, cbError) => async (
  dispatch,
  getState
) => {
  try {
    const res = await call({
      url: `${endpoints.matches}/${match._id}`,
      method: "DELETE"
    });
    const { data } = res;
    const {
      matchDetails: { matchList }
    } = getState();
    const newMatchList = matchList.filter(el => el._id !== match._id);
    dispatch({
      type: DELETE_MATCH,
      payload: newMatchList
    });
    dispatch(setUserDetails(data));
  } catch (e) {
    console.log("match joining err ", e);
  }
};

const updateMatch = async (data, id) => {
  const res = await call({
    url: `${endpoints.matches}/${id}`,
    method: "PUT",
    data
  });
  return res;
};

export const resetMatches = () => ({ type: RESET_MATCHES });

export const acceptInvite = () => {};

export const sendInvite = (match, cbSuccess, cbError) => async (
  dispatch,
  getState
) => {
  const updateObj = { isJoinee: true };
  const res = await updateMatch(updateObj, match._id);
  const { data } = res;
  const {
    matchDetails: { matchList }
  } = getState();
  const newList = matchList.map(el => {
    if (el._id === match._id) {
      return data;
    }
    return el;
  });
  dispatch({ type: SET_MATCH_LIST, payload: newList });
  dispatch(setUserDetails(data.joinee));
};

const getReducer = {
  [SET_MATCH_DETAILS]: ({ state, action: { payload } }) => {
    return {
      ...state,
      matchList: [payload, ...state.matchList]
    };
  },
  [SET_MATCH_LIST]: ({ state, action: { payload } }) => {
    return {
      ...state,
      matchList: [...payload]
    };
  },
  [ADD_MATCH]: ({ state, action: { payload } }) => {
    return { ...state, matchList: [payload, ...state.matchList] };
  },
  [DELETE_MATCH]: ({ state, action: { payload } }) => {
    return { ...state, matchList: [...payload] };
  },
  [RESET_MATCHES]: ({ state }) => ({ ...initialState })
};

export default function (state = initialState, action) {
  const { type } = action;
  const doAction = getReducer[type];
  return doAction ? doAction({ state, action }) : state;
}
