import call from "api/apiRequest";
import endpoints from "api/endpoints";
import { MATCH_STATUS } from "../../../constants";

const SET_MATCHES = "dashboard/SET_MATCHES";
const SET_USERS = "dashboard/SET_USERS";
const SET_TOTAL_MATCHES = "dashboard/SET_TOTAL_MATCHES";
const SET_COMPLETED_MATCHES = "dashboard/SET_COMPLETED_MATCHES";
const SET_IS_USERS_LOADING = "dashboard/SET_IS_USERS_LOADING";
const SET_IS_MATCHES_LOADING = "dashboard/SET_IS_MATCHES_LOADING";
const SET_FILTER = "dashboard/SET_FILTER";
const RESET_DASHBOARD = "dashboard/RESET_DASHBOARD";

export const DASHBOARD_FILTERS = {
  lifetime: "Lifetime",
  today: "Today",
  week: "This week"
};

const initialState = {
  matches: [],
  users: {},
  totalMatches: {},
  completedMatches: {},
  isMatchesLoading: false,
  isUsersLoading: false,
  filter: DASHBOARD_FILTERS.lifetime
};

const generateParams = filter => {
  const params = {};
  const currentDate = new Date();
  const oneDayDiff = 24 * 60 * 60 * 1000;
  const oneWeekDiff = 7 * oneDayDiff;
  switch (filter) {
    case DASHBOARD_FILTERS.today:
      params.startDate = new Date(currentDate - oneDayDiff);
      break;
    case DASHBOARD_FILTERS.week:
      params.startDate = new Date(currentDate - oneWeekDiff);
  }
  return params;
};

export const getMatchesStats = () => async (dispatch, getState) => {
  dispatch({ type: SET_IS_MATCHES_LOADING, payload: true });
  try {
    const {
      dashboard: { filter }
    } = getState();
    const params = generateParams(filter);
    const res = await call({
      url: `${endpoints.matchesStats}`,
      params
    });
    const { data } = res.data;
    const totalMatches = data.reduce((acc, current) => {
      acc.matchesNumber = acc.matchesNumber
        ? acc.matchesNumber + current.matchesNumber
        : current.matchesNumber;
      acc.profit = acc.profit ? acc.profit + current.profit : current.profit;
      return acc;
    }, {});
    const completedMatches =
      data.find(item => item._id === MATCH_STATUS.completed) || {};
    dispatch({ type: SET_COMPLETED_MATCHES, payload: completedMatches });
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

export const getUsersStats = () => async (dispatch, getState) => {
  dispatch({ type: SET_IS_USERS_LOADING, payload: true });
  try {
    const {
      dashboard: { filter }
    } = getState();
    const params = generateParams(filter);
    const res = await call({
      url: `${endpoints.usersStats}`,
      params
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

export const setFilter = filter => ({ type: SET_FILTER, payload: filter });

export const resetDashboard = () => ({ type: RESET_DASHBOARD });

const getReducer = {
  [SET_MATCHES]: ({ state, action: { payload } }) => ({
    ...state,
    matches: payload
  }),
  [SET_IS_MATCHES_LOADING]: ({ state, action: { payload } }) => ({
    ...state,
    isMatchesLoading: payload
  }),
  [SET_USERS]: ({ state, action: { payload } }) => ({
    ...state,
    users: payload
  }),
  [SET_IS_USERS_LOADING]: ({ state, action: { payload } }) => ({
    ...state,
    isUsersLoading: payload
  }),
  [SET_TOTAL_MATCHES]: ({ state, action: { payload } }) => ({
    ...state,
    totalMatches: payload
  }),
  [SET_FILTER]: ({ state, action: { payload } }) => ({
    ...state,
    filter: payload
  }),
  [SET_COMPLETED_MATCHES]: ({ state, action: { payload } }) => ({
    ...state,
    completedMatches: payload
  }),
  [RESET_DASHBOARD]: () => ({ ...initialState })
};

export default function (state = initialState, action) {
  const { type } = action;
  const doAction = getReducer[type];
  return doAction ? doAction({ state, action }) : state;
}
