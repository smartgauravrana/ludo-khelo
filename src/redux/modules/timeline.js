import call from "api/apiRequest";
import endpoints from "api/endpoints";

const SET_TIMELINE = "timeline/SET_TIMELINE";
const SET_IS_LOADING = "timeline/SET_IS_LOADING";
const SET_TOTAL = "timeline/SET_TOTAL";

const initialState = {
  timeline: [],
  isLoading: false,
  total: 0
};

export const getTimeline = (
  options = {},
  cbSuccess,
  cbError
) => async dispatch => {
  dispatch({ type: SET_IS_LOADING, payload: true });
  try {
    const res = await call({
      url: `${endpoints.matches}`,
      params: {
        history: true,
        page: options.page || 1
      }
    });
    const { data, total } = res.data;
    cbSuccess && cbSuccess(data);
    dispatch({ type: SET_TIMELINE, payload: data });
    dispatch({ type: SET_TOTAL, payload: total });
  } catch (e) {
    console.log("post match err");
    cbError && cbError(e);
  } finally {
    dispatch({ type: SET_IS_LOADING, payload: false });
  }
};

const getReducer = {
  [SET_TIMELINE]: ({ state, action: { payload } }) => {
    return {
      ...state,
      timeline: [...payload]
    };
  },
  [SET_TOTAL]: ({ state, action: { payload } }) => ({
    ...state,
    total: payload
  }),
  [SET_IS_LOADING]: ({ state, action: { payload } }) => ({
    ...state,
    isLoading: payload
  })
};

export default function (state = initialState, action) {
  const { type } = action;
  const doAction = getReducer[type];
  return doAction ? doAction({ state, action }) : state;
}
