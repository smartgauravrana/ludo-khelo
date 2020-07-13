import call from "api/apiRequest";
import endpoints from "api/endpoints";

const SET_SETTINGS = "settings/SET_SETTINGS";

const initialState = {
  settings: {
    paytmMail: "",
    paytmNumber: "",
    supportNumber: ""
  }
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

export const updateSettings = (
  settingsData,
  cbSuccess,
  cbError
) => async dispatch => {
  try {
    const res = await call({
      url: endpoints.settings,
      method: "put",
      data: settingsData
    });
    const { data } = res.data;
    dispatch({ type: SET_SETTINGS, payload: data });
    cbSuccess && cbSuccess(data);
  } catch (e) {
    console.log(e);
    cbError && cbError(e);
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
