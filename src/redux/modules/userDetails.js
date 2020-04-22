const SET_USER_DETAILS = "userDetails/SET_USER_DETAILS";

const initialState = {
  userDataLoading: false
};

export const getUserDetails = () => dispatch =>
  setTimeout(
    () =>
      dispatch({
        type: SET_USER_DETAILS,
        payload: { name: "gaurav" }
      }),
    3000
  );

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
