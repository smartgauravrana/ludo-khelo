import call from "api/apiRequest";
import endpoints from "api/endpoints";

const SET_IS_LOADING = "manageWithdrawls/SET_IS_LOADING";
const SET_SELL_REQUESTS = "manageWithdrawls/SET_SELL_REQUESTS";
const SET_TOTAL = "manageWithdrawls/SET_TOTAL";
const RESET_MANAGE_WITHDRAWLS = "manageWithdrawls/RESET_MANAGE_WITHDRAWLS";

const initialState = {
  sellRequests: [],
  isLoading: false,
  total: null
};

export const getSellRequests = ({
  options = {},
  cbSuccess,
  cbError
}) => async dispatch => {
  dispatch({ type: SET_IS_LOADING, payload: true });
  try {
    const res = await call({
      url: `${endpoints.sell}`,
      params: options
    });
    const { data, total } = res.data;
    dispatch({ type: SET_SELL_REQUESTS, payload: data });
    dispatch({ type: SET_TOTAL, payload: total });
    cbSuccess && cbSuccess(data);
  } catch (e) {
    console.log("get sell requests err");
    cbError && cbError(e);
  } finally {
    dispatch({ type: SET_IS_LOADING, payload: false });
  }
};

export const updateSellRequest = ({
  sellId,
  updateObj,
  cbSuccess,
  cbError
}) => async dispatch => {
  dispatch({ type: SET_IS_LOADING, payload: true });
  try {
    const res = await call({
      url: `${endpoints.sell}/${sellId}`,
      method: "put",
      data: updateObj
    });
    const { data } = res.data;
    cbSuccess && cbSuccess(data);
  } catch (e) {
    console.log("get sell requests err");
    cbError && cbError(e);
  } finally {
    dispatch({ type: SET_IS_LOADING, payload: false });
  }
};

export const resetManageWithdrawls = () => ({ type: RESET_MANAGE_WITHDRAWLS });

const getReducer = {
  [SET_IS_LOADING]: ({ state, action: { payload } }) => ({
    ...state,
    isLoading: payload
  }),
  [SET_SELL_REQUESTS]: ({ state, action: { payload } }) => ({
    ...state,
    sellRequests: payload
  }),
  [SET_TOTAL]: ({ state, action: { payload } }) => ({
    ...state,
    total: payload
  }),
  [RESET_MANAGE_WITHDRAWLS]: () => ({ ...initialState })
};

export default function (state = initialState, action) {
  const { type } = action;
  const doAction = getReducer[type];
  return doAction ? doAction({ state, action }) : state;
}
