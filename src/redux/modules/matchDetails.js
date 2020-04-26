import call from "api/apiRequest";
import endpoints from "api/endpoints";

const SET_MATCH_DETAILS = "matchDetails/SET_MATCH_DETAILS";

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

const getReducer = {
  [SET_MATCH_DETAILS]: ({ state, action: { payload } }) => {
    return {
      ...state,
      matchList: [payload, ...state.matchList]
    };
  }
};

export default function (state = initialState, action) {
  const { type } = action;
  const doAction = getReducer[type];
  return doAction ? doAction({ state, action }) : state;
}
