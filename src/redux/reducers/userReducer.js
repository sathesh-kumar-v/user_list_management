import {
  GET_USERS_REQUEST,
  GET_USERS_SUCCESS,
  GET_USERS_FAILURE,
  CREATE_USER_REQUEST,
  CREATE_USER_SUCCESS,
  CREATE_USER_FAILURE,
  UPDATE_USER_REQUEST,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_FAILURE,
  DELETE_USER_REQUEST,
  DELETE_USER_SUCCESS,
  DELETE_USER_FAILURE,
  SET_SEARCH_QUERY,
  SET_CURRENT_PAGE,
} from '../types';

const initialState = {
  users: [],
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  totalUsers: 0,
  searchQuery: '',
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_USERS_REQUEST:
    case CREATE_USER_REQUEST:
    case UPDATE_USER_REQUEST:
    case DELETE_USER_REQUEST:
      return { ...state, loading: true, error: null };

    case GET_USERS_SUCCESS:
      return {
        ...state,
        loading: false,
        users: action.payload.data, // Data array of users
        currentPage: action.payload.page,
        totalPages: action.payload.total_pages,
        totalUsers: action.payload.total,
      };

    case CREATE_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        users: [action.payload, ...state.users],
      };

    case UPDATE_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        users: state.users.map((user) =>
          user.id === action.payload.id
            ? { ...user, ...action.payload.data }
            : user,
        ),
      };

    case DELETE_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        users: state.users.filter((user) => user.id !== action.payload),
      };

    case GET_USERS_FAILURE:
    case CREATE_USER_FAILURE:
    case UPDATE_USER_FAILURE:
    case DELETE_USER_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case SET_SEARCH_QUERY:
      return { ...state, searchQuery: action.payload };

    case SET_CURRENT_PAGE:
      return { ...state, currentPage: action.payload };

    default:
      return state;
  }
};

export default userReducer;
