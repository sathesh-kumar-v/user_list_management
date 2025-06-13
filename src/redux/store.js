import { createStore, applyMiddleware, compose } from 'redux';
import { thunk } from 'redux-thunk'; // Correct import for redux-thunk
import rootReducer from './reducers';

// Setup Redux DevTools Extension for browser
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk)) // Apply redux-thunk middleware
);

export default store;