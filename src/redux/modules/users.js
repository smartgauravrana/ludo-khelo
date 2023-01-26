import call from "@/apis/apiRequest";
import endpoints from "@/apis/endpoints";

const SET_IS_USERS_LOADING = "users/SET_IS_USERS_LOADING";
const SET_USERS_LIST = "users/SET_USERS_LIST";
const SET_TOTAL = "users/SET_TOTAL";
const RESET_USERS = "users/RESET_USERS";

const initialState = {
  usersList: [],
  isUsersLoading: false,
  total: null,
  referralsCount: 0,
};

export const getAllUsers =
  (options = {}, cbSuccess, cbError) =>
  async (dispatch) => {
    dispatch({ type: SET_IS_USERS_LOADING, payload: true });
    try {
      const res = await call({
        url: `${endpoints.users}`,
        params: options,
      });
      const { data, total } = res.data;
      dispatch({ type: SET_USERS_LIST, payload: data });
      dispatch({ type: SET_TOTAL, payload: total });
      cbSuccess && cbSuccess(data);
    } catch (e) {
      console.log("get all users err");
      cbError && cbError(e);
    } finally {
      dispatch({ type: SET_IS_USERS_LOADING, payload: false });
    }
  };

export const addChips =
  ({ userId, chips }, cbSuccess, cbError) =>
  async (dispatch, getState) => {
    try {
      const res = await call({
        url: `${endpoints.users}/${userId}`,
        method: "Put",
        data: { addChips: chips || 0 },
      });
      const { data } = res.data;
      // updating user in list
      const {
        users: { usersList },
      } = getState();
      const newList = usersList.map((user) => {
        if (user._id === userId) {
          return data;
        }
        return user;
      });
      dispatch({ type: SET_USERS_LIST, payload: newList });
      cbSuccess && cbSuccess(data);
    } catch (e) {
      console.log("users chips add err");
      cbError && cbError(e);
    }
  };

export const resetUsers = () => ({ type: RESET_USERS });

const getReducer = {
  [SET_IS_USERS_LOADING]: ({ state, action: { payload } }) => ({
    ...state,
    isUsersLoading: payload,
  }),
  [SET_USERS_LIST]: ({ state, action: { payload } }) => ({
    ...state,
    usersList: payload,
  }),
  [SET_TOTAL]: ({ state, action: { payload } }) => ({
    ...state,
    total: payload,
  }),
  [RESET_USERS]: () => ({ ...initialState }),
};

export default function (state = initialState, action) {
  const { type } = action;
  const doAction = getReducer[type];
  return doAction ? doAction({ state, action }) : state;
}
