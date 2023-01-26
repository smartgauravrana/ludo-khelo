import call from "@/apis/apiRequest";
import endpoints from "@/apis/endpoints";

const SET_USER_DETAILS = "userDetails/SET_USER_DETAILS";
const SET_REFERRAL_COUNT = "userDetails/SET_REFERRAL_COUNT";

const initialState = {};

export const login = (loginData, cbSuccess, cbError) => async (dispatch) => {
  try {
    const res = await call({
      method: "post",
      url: endpoints.login,
      data: loginData,
    });
    console.log("res: ", res);
    const { data } = res.data;
    dispatch({ type: SET_USER_DETAILS, payload: data });
    cbSuccess && cbSuccess(data);
  } catch (e) {
    console.log("login err: ", e);
    cbError && cbError(e);
  }
};

export const register =
  (registerData, cbSuccess, cbError) => async (dispatch) => {
    try {
      const res = await call({
        method: "post",
        url: endpoints.register,
        data: registerData,
      });
      const { data } = res.data;
      // dispatch({ type: SET_USER_DETAILS, payload: data });
      cbSuccess && cbSuccess(data);
    } catch (e) {
      cbError && cbError(e);
    }
  };

export const checkLogin = (cbSuccess, cbError) => async (dispatch) => {
  const res = await call({ url: endpoints.currentUser });
  const { data } = res.data;
  cbSuccess && cbSuccess(data || {});
  dispatch({ type: SET_USER_DETAILS, payload: data });
};

export const buyChips =
  (transactionData, cbSuccess, cbError) => async (dispatch) => {
    try {
      const res = await call({
        method: "POST",
        url: endpoints.buy,
        data: transactionData,
      });
      const { data } = res.data;
      cbSuccess && cbSuccess(data);
      dispatch({ type: SET_USER_DETAILS, payload: data });
    } catch (err) {
      cbError && cbError(err);
    }
  };

export const sellChips = (sellData, cbSuccess, cbError) => async (dispatch) => {
  try {
    const res = await call({
      method: "POST",
      url: endpoints.sell,
      data: sellData,
    });
    const { data } = res.data;
    dispatch({ type: SET_USER_DETAILS, payload: data });
    cbSuccess && cbSuccess(data);
  } catch (e) {
    console.log("Selling chips api err: ", e);
    cbError && cbError(e);
  }
};

export const addDevice = (playerId) => async (dispatch) => {
  try {
    await call({
      method: "POST",
      url: endpoints.notificationDevices,
      data: { playerId },
    });
  } catch (e) {
    console.log("Adding device err: ", e);
  }
};

export const setUserDetails = (userDetails) => ({
  type: SET_USER_DETAILS,
  payload: userDetails,
});

export const getReferrals = () => async (dispatch) => {
  try {
    const res = await call({
      url: `${endpoints.referralsCount}`,
    });
    const { data, total } = res.data;
    dispatch({ type: SET_REFERRAL_COUNT, payload: data.totalReferrals });
  } catch (e) {
    console.log("get all users err");
  }
};

const getReducer = {
  [SET_USER_DETAILS]: ({ state, action: { payload } }) => {
    return {
      ...state,
      ...payload,
    };
  },
  [SET_REFERRAL_COUNT]: ({ state, action: { payload } }) => ({
    ...state,
    referralsCount: payload,
  }),
};

export default function (state = initialState, action) {
  const { type } = action;
  const doAction = getReducer[type];
  return doAction ? doAction({ state, action }) : state;
}
