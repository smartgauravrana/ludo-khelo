import call from "api/apiRequest";
import endpoints from "api/endpoints";

const SET_SETTINGS = "settings/SET_SETTINGS";

const initialState = {
  settings: {}
};

export const fetchSettings = () => async dispatch => {
  try {
    const res = await call({ url: endpoints.settings });
    const { data } = res.data;
    dispatch({ type: SET_SETTINGS, payload: data });
  } catch (e) {
    console.log(e);
  }
};

const getReducer = {
  [SET_SETTINGS]: ({ state, action: { payload } }) => {
    return {
      ...state,
      settings: payload
    };
  }
};

export default function (state = initialState, action) {
  const { type } = action;
  const doAction = getReducer[type];
  return doAction ? doAction({ state, action }) : state;
}
