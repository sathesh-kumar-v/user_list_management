import { usersApi } from '../../api/reqres';
import {
  GET_USERS_REQUEST, GET_USERS_SUCCESS, GET_USERS_FAILURE,
  CREATE_USER_REQUEST, CREATE_USER_SUCCESS, CREATE_USER_FAILURE,
  UPDATE_USER_REQUEST, UPDATE_USER_SUCCESS, UPDATE_USER_FAILURE,
  DELETE_USER_REQUEST, DELETE_USER_SUCCESS, DELETE_USER_FAILURE,
  SET_SEARCH_QUERY, SET_CURRENT_PAGE
} from '../types';

export const getUsers = (page) => async (dispatch) => {
  dispatch({ type: GET_USERS_REQUEST });
  try {
    const response = await usersApi.getUsers(page);
    dispatch({ type: GET_USERS_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: GET_USERS_FAILURE, payload: error.message });
  }
};

export const createUser = (userData) => async (dispatch) => {
  dispatch({ type: CREATE_USER_REQUEST });
  try {
    const response = await usersApi.createUser(userData);
    dispatch({ type: CREATE_USER_SUCCESS, payload: response.data });
    // Optionally refresh user list after creation (e.g., go to first page)
    dispatch(getUsers(1));
    return response.data; // Return data for success check in modal
  } catch (error) {
    const errorMessage = error.response?.data?.error || 'Failed to create user.';
    dispatch({ type: CREATE_USER_FAILURE, payload: errorMessage });
    return { error: true, message: errorMessage }; // Indicate failure
  }
};

export const updateUser = (id, userData) => async (dispatch) => {
  dispatch({ type: UPDATE_USER_REQUEST });
  try {
    const response = await usersApi.updateUser(id, userData);
    dispatch({ type: UPDATE_USER_SUCCESS, payload: response.data });
    // Optionally refresh user list after update
    dispatch(getUsers(1));
    return response.data; // Return data for success check in modal
  } catch (error) {
    const errorMessage = error.response?.data?.error || 'Failed to update user.';
    dispatch({ type: UPDATE_USER_FAILURE, payload: errorMessage });
    return { error: true, message: errorMessage }; // Indicate failure
  }
};

export const deleteUser = (id) => async (dispatch) => {
  dispatch({ type: DELETE_USER_REQUEST });
  try {
    await usersApi.deleteUser(id);
    dispatch({ type: DELETE_USER_SUCCESS, payload: id });
    // Optionally refresh user list after deletion
    dispatch(getUsers(1));
  } catch (error) {
    dispatch({ type: DELETE_USER_FAILURE, payload: error.message });
  }
};

export const setSearchQuery = (query) => ({
  type: SET_SEARCH_QUERY,
  payload: query,
});

export const setCurrentPage = (page) => ({
  type: SET_CURRENT_PAGE,
  payload: page,
});