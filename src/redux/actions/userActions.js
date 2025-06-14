import { usersApi } from '../../api/reqres';
import {
  GET_USERS_REQUEST,
  GET_USERS_SUCCESS,
  GET_USERS_FAILURE,
  CREATE_USER_REQUEST,
  CREATE_USER_SUCCESS,
  UPDATE_USER_REQUEST,
  UPDATE_USER_SUCCESS,
  DELETE_USER_REQUEST,
  DELETE_USER_SUCCESS,
  DELETE_USER_FAILURE,
  SET_SEARCH_QUERY,
  SET_CURRENT_PAGE,
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

    // Simulate ID since Reqres doesn't return one
    const newUser = {
      ...userData,
      id: Math.floor(Math.random() * 10000),
      ...response.data,
    };

    dispatch({ type: CREATE_USER_SUCCESS, payload: newUser });
    return { success: true };
  } catch (error) {
    console.error('Create user failed:', error.response?.data || error.message);
    dispatch({ type: 'CREATE_USER_FAIL', payload: error.message });
    return { error: true };
  }
};

export const updateUser = (id, updatedData) => async (dispatch) => {
  dispatch({ type: UPDATE_USER_REQUEST });

  try {
    await usersApi.updateUser(id, updatedData);

    dispatch({
      type: UPDATE_USER_SUCCESS,
      payload: { id, data: updatedData },
    });

    return { success: true };
  } catch (error) {
    console.error('Update error:', error.response?.data || error.message);
    dispatch({ type: 'UPDATE_USER_FAIL', payload: error.message });
    return { error: true };
  }
};

export const deleteUser = (id) => async (dispatch) => {
  dispatch({ type: DELETE_USER_REQUEST });

  try {
    await usersApi.deleteUser(id);

    dispatch({ type: DELETE_USER_SUCCESS, payload: id });

  } catch (error) {
    console.error('Delete error:', error.response?.data || error.message);
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
