import { authApi } from '../../api/reqres';
import { AUTH_LOGIN_REQUEST, AUTH_LOGIN_SUCCESS, AUTH_LOGIN_FAILURE, AUTH_LOGOUT} from '../types';

export const login = (email, password) => async (dispatch) => {
  dispatch({ type: AUTH_LOGIN_REQUEST });
  try {
    const response = await authApi.login(email, password);

    // Save the token in local storage
    localStorage.setItem('authToken', response.data.token);
    dispatch({ type: AUTH_LOGIN_SUCCESS, payload: response.data.token });
    return true;
  } catch (error) {
    const errorMessage =
      error.response?.data?.error ||
      'Login failed. Please check your credentials.';
    dispatch({ type: AUTH_LOGIN_FAILURE, payload: errorMessage });
    return false; // Indicate failure
  }
};

export const logout = () => (dispatch) => {
  localStorage.removeItem('authToken');
  dispatch({ type: AUTH_LOGOUT });
};
