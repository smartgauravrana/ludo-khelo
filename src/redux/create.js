import { createStore, applyMiddleware, compose } from "redux";
import reduxThunk from "redux-thunk";

import reducer from "./modules";

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION__
  ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  : compose;

export default (initialState = {}) => {
  return createStore(
    reducer,
    initialState,
    composeEnhancer(applyMiddleware(reduxThunk))
  );
};
