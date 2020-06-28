import call from "api/apiRequest";
import endpoints from "api/endpoints";

const SET_MATCHES = "dashboard/SET_MATCHES";
const SET_USERS = "dashboard/SET_USERS";
const SET_TOTAL_MATCHES = "dashboard/SET_TOTAL_MATCHES";
const SET_IS_USERS_LOADING = "dashboard/SET_IS_USERS_LOADING";
const SET_IS_MATCHES_LOADING = "dashboard/SET_IS_MATCHES_LOADING";
const RESET_DASHBOARD = "dashboard/RESET_DASHBOARD";

const initialState = {
  matches: [],
  users: {},
  totalMatches: [],
  isMatchesLoading: false,
  isUsersFetching: false
};

export const getMatchesStats = () => async dispatch => {
  try {
    const res = await call({
      url: `${endpoints.matchesStats}`
    });
    const { data } = res.data;
    const totalMatches = data.reduce((acc, current) => {
      acc.matchesNumber = acc.matchesNumber
        ? acc.matchesNumber + current.matchesNumber
        : current.matchesNumber;
      acc.profit = acc.profit ? acc.profit + current.profit : current.profit;
      return acc;
    }, {});
    dispatch({ type: SET_TOTAL_MATCHES, payload: totalMatches });
    dispatch({ type: SET_MATCHES, payload: data });
    // cbSuccess && cbSuccess(data);
  } catch (e) {
    console.log("get matches stats err");
    // cbError && cbError(e);
  } finally {
    dispatch({ type: SET_IS_MATCHES_LOADING, payload: false });
  }
};

export const getUsersStats = () => async dispatch => {
  try {
    const res = await call({
      url: `${endpoints.usersStats}`
    });
    const { data } = res.data;
    dispatch({ type: SET_USERS, payload: data[0] });
    // cbSuccess && cbSuccess(data);
  } catch (e) {
    console.log("get users stats err");
    // cbError && cbError(e);
  } finally {
    dispatch({ type: SET_IS_USERS_LOADING, payload: false });
  }
};

export const resetDashboard = () => ({ type: RESET_DASHBOARD });

const getReducer = {
  [SET_MATCHES]: ({ state, action: { payload } }) => ({
    ...state,
    matches: payload
  }),
  [SET_IS_MATCHES_LOADING]: ({ state, action: { value } }) => ({
    ...state,
    isMatchesLoading: value
  }),
  [SET_USERS]: ({ state, action: { payload } }) => ({
    ...state,
    users: payload
  }),
  [SET_IS_USERS_LOADING]: ({ state, action: { value } }) => ({
    ...state,
    isUsersLoading: value
  }),
  [SET_TOTAL_MATCHES]: ({ state, action: { payload } }) => ({
    ...state,
    totalMatches: payload
  }),
  [RESET_DASHBOARD]: () => ({ ...initialState })
};

export default function (state = initialState, action) {
  const { type } = action;
  const doAction = getReducer[type];
  return doAction ? doAction({ state, action }) : state;
}
