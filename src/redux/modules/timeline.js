import call from "api/apiRequest";
import endpoints from "api/endpoints";

const SET_TIMELINE = "matchDetails/SET_TIMELINE";

const initialState = {
  timeline: []
};

export const getTimeline = (cbSuccess, cbError) => async dispatch => {
  try {
    const res = await call({
      url: `${endpoints.matches}`,
      params: {
        history: true
      }
    });
    const { data } = res;
    cbSuccess && cbSuccess(data);
    dispatch({ type: SET_TIMELINE, payload: data });
  } catch (e) {
    console.log("post match err");
    cbError && cbError(e);
  }
};

const getReducer = {
  [SET_TIMELINE]: ({ state, action: { payload } }) => {
    return {
      ...state,
      timeline: [payload, ...state.timeline]
    };
  }
};

export default function (state = initialState, action) {
  const { type } = action;
  const doAction = getReducer[type];
  return doAction ? doAction({ state, action }) : state;
}
