import call from "api/apiRequest";
import endpoints from "api/endpoints";

const SET_MATCH_DETAILS = "matchDetails/SET_MATCH_DETAILS";
const SET_MATCH_LIST = "matchDetails/SET_MATCH_LIST";

const initialState = {
  matchList: []
};

export const postMatch = (match, cbSuccess, cbError) => async dispatch => {
  try {
    const res = await call({
      method: "post",
      url: endpoints.matches,
      data: match
    });
    const { data } = res;
    cbSuccess && cbSuccess(data);
    dispatch({ type: SET_MATCH_DETAILS, payload: data });
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
  }
};

export default function (state = initialState, action) {
  const { type } = action;
  const doAction = getReducer[type];
  return doAction ? doAction({ state, action }) : state;
}
