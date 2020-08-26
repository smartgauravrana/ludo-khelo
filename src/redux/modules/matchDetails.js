import call from "api/apiRequest";
import endpoints from "api/endpoints";
import { setUserDetails } from "./userDetails";
import { MATCH_STATUS } from "../../../constants";
import { isEmpty } from "../../../utils";

const SET_MATCH_DETAILS = "matchDetails/SET_MATCH_DETAILS";
const SET_MATCH_LIST = "matchDetails/SET_MATCH_LIST";
const ADD_MATCH = "matchDetails/ADD_MATCH";
const DELETE_MATCH = "matchDetails/DELETE_MATCH";
const SET_IS_LOADING = "matchDetails/SET_IS_LOADING";
const SET_HAS_MORE = "matchDetails/SET_HAS_MORE";
const SET_NEXT = "matchDetails/SET_NEXT";
const RESET_MATCHES = "matchDetails/RESET_MATCHES";

const initialState = {
  matchList: [],
  hasMore: true,
  isLoading: false,
  next: ""
};

export const postResult = (postData, cbSuccess, cbError) => async dispatch => {
  try {
    const res = await call({
      method: "post",
      url: endpoints.result,
      data: postData
    });
    const { data } = res.data;
    cbSuccess && cbSuccess(data);
  } catch (e) {
    console.log("post result err");
    cbError && cbError(e);
  }
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
    const { data } = res.data;
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

export const getMatch = (matchId, cbSuccess, cbError) => async (
  dispatch,
  getState
) => {
  try {
    console.log("calling getMatch");
    const res = await call({
      url: `${endpoints.matches}/${matchId}`
    });
    const { data } = res.data;
    const {
      matchDetails: { matchList }
    } = getState();
    const newList = matchList.map(el => {
      if (el._id === matchId) {
        return data;
      }
      return el;
    });
    cbSuccess && cbSuccess(data);
    dispatch({ type: SET_MATCH_LIST, payload: newList });
  } catch (e) {
    console.log("get match err");
    cbError && cbError(e);
  }
};

export const getAllMatches = (cbSuccess, cbError) => async (
  dispatch,
  getState
) => {
  dispatch({ type: SET_IS_LOADING, value: true });
  const {
    userDetails: { isAdmin },
    matchDetails: { next }
  } = getState();
  const params = {};
  if (isAdmin) {
    params.isOfficial = true;
  }
  // fetching only playable matches by status
  // params[
  //   "status[nin]"
  // ] = `${MATCH_STATUS.completed}, ${MATCH_STATUS.cancelled}, ${MATCH_STATUS.onHold}`;
  if (next) {
    params["_id[gt]"] = next;
  }
  try {
    const res = await call({
      url: `${endpoints.matches}`,
      params
    });
    const { data } = res.data;
    if (isEmpty(data) || data.length < 10) {
      dispatch({ type: SET_HAS_MORE, value: false });
    }
    dispatch({ type: SET_NEXT, value: !isEmpty(data) ? data[0]._id : "" });
    dispatch({ type: SET_MATCH_LIST, payload: data });

    cbSuccess && cbSuccess(data);
  } catch (e) {
    console.log("GET ALL matches err: ", e);
    cbError && cbError(e);
  } finally {
    dispatch({ type: SET_IS_LOADING, value: false });
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
    const { data } = res.data;
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

export const acceptInvite = ({ match, roomId }, cbSuccess, cbError) => async (
  dispatch,
  getState
) => {
  const updateObj = { roomId };
  const res = await updateMatch(updateObj, match._id);
  const { data } = res.data;
  const {
    matchDetails: { matchList }
  } = getState();
  const newList = matchList.map(el => {
    if (el._id === match._id) {
      return data;
    }
    return el;
  });
  cbSuccess && cbSuccess(data);
  dispatch({ type: SET_MATCH_LIST, payload: newList });
};

export const sendInvite = (match, cbSuccess, cbError) => async (
  dispatch,
  getState
) => {
  const updateObj = { isJoinee: true };
  try {
    const res = await updateMatch(updateObj, match._id);
    const { data } = res.data;
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
    cbSuccess && cbSuccess(data);
  } catch (err) {
    console.log("play requested err: ", err);
    cbError && cbError(err);
  }
};

export const leaveMatch = (match, cbSuccess, cbError) => async (
  dispatch,
  getState
) => {
  try {
    const updateObj = { leaveMatch: true };
    const res = await updateMatch(updateObj, match._id);
    const { data } = res.data;
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
    cbSuccess && cbSuccess(data);
  } catch (e) {
    console.log("leaving Match err!", e);
    cbError && cbError(e);
  }
};

export const updateMatchStatus = (matchId, status) => (dispatch, getState) => {
  const {
    matchDetails: { matchList }
  } = getState();
  const newList = matchList.map(el => {
    if (el._id === matchId) {
      return { ...el, status };
    }
    return el;
  });
  dispatch({ type: SET_MATCH_LIST, payload: newList });
};

export const removeMatch = matchId => (dispatch, getState) => {
  const {
    matchDetails: { matchList }
  } = getState();
  const newList = matchList.filter(el => el._id !== matchId);
  dispatch({ type: SET_MATCH_LIST, payload: newList });
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
  [SET_IS_LOADING]: ({ state, action: { value } }) => ({
    ...state,
    isLoading: value
  }),
  [SET_HAS_MORE]: ({ state, action: { value } }) => ({
    ...state,
    hasMore: value
  }),
  [SET_NEXT]: ({ state, action: { value } }) => ({ ...state, next: value }),
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
