import call from "api/apiRequest";
import endpoints from "api/endpoints";

const SET_MATCHES = "manage/SET_MATCHES";
const SET_TOTAL = "manage/SET_TOTAL";
const SET_IS_MATCHES_LOADING = "manage/SET_IS_MATCHES_LOADING";
const RESET_MATCHES = "manage/RESET_MATCHES";

const initialState = {
  matches: [],
  total: 0,
  isMatchesLoading: false
};

export const getMatches = ({
  options = {},
  cbSuccess,
  cbError
}) => async dispatch => {
  dispatch({ type: SET_IS_MATCHES_LOADING, payload: true });
  try {
    const res = await call({
      url: `${endpoints.matches}`,
      params: options
    });
    const { data } = res.data;
    const { total } = res.data;
    cbSuccess && cbSuccess(data);
    dispatch({ type: SET_MATCHES, payload: data });
    dispatch({ type: SET_TOTAL, payload: total });
  } catch (e) {
    console.log("get matches err");
    cbError && cbError(e);
  } finally {
    dispatch({ type: SET_IS_MATCHES_LOADING, payload: false });
  }
};

const getReducer = {
  [SET_MATCHES]: ({ state, action: { payload } }) => ({
    ...state,
    matches: payload
  }),
  [SET_TOTAL]: ({ state, action: { payload } }) => ({
    ...state,
    total: payload
  }),
  [SET_IS_MATCHES_LOADING]: ({ state, action: { payload } }) => ({
    ...state,
    isMatchesLoading: payload
  }),
  [RESET_MATCHES]: ({ state, action }) => ({
    ...initialState
  })
};

export default function (state = initialState, action) {
  const { type } = action;
  const doAction = getReducer[type];
  return doAction ? doAction({ state, action }) : state;
}
