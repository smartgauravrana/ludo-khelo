import call from "api/apiRequest";
import endpoints from "api/endpoints";

const SET_USER_DETAILS = "userDetails/SET_USER_DETAILS";

const initialState = {
  userDataLoading: false
};

export const login = (loginData, cbSuccess, cbError) => async dispatch => {
  try {
    const res = await call({
      method: "post",
      url: endpoints.login,
      data: loginData
    });
    console.log("res: ", res);
    const { data } = res;
    dispatch({ type: SET_USER_DETAILS, payload: data });
    cbSuccess && cbSuccess(data);
  } catch (e) {
    console.log("login err: ", e);
    cbError && cbError(e);
  }
};

const getReducer = {
  [SET_USER_DETAILS]: ({ state, action: { payload } }) => {
    return {
      ...state,
      ...payload,
      userDataLoading: false
    };
  }
};

export default function (state = initialState, action) {
  const { type } = action;
  const doAction = getReducer[type];
  return doAction ? doAction({ state, action }) : state;
}
