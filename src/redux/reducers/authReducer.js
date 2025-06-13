import { AUTH_LOGIN_REQUEST, AUTH_LOGIN_SUCCESS, AUTH_LOGIN_FAILURE, AUTH_LOGOUT } from '../types';

const initialState = {
  token: localStorage.getItem('authToken') || null,
  isAuthenticated: !!localStorage.getItem('authToken'), // Check if token exists
  loading: false,
  error: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case AUTH_LOGIN_REQUEST:
      return { ...state, loading: true, error: null };
    case AUTH_LOGIN_SUCCESS:
      return { ...state, loading: false, isAuthenticated: true, token: action.payload, error: null };
    case AUTH_LOGIN_FAILURE:
      return { ...state, loading: false, isAuthenticated: false, token: null, error: action.payload };
    case AUTH_LOGOUT:
      return { ...state, isAuthenticated: false, token: null, error: null };
    default:
      return state;
  }
};

export default authReducer;