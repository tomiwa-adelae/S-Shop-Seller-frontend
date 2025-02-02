import axios from 'axios';
import { clearErrors, returnErrors } from './errorActions';
import {
   LOGIN_USER_REQUEST,
   LOGIN_USER_SUCCESS,
   LOGIN_USER_FAIL,
   REGISTER_USER_SUCCESS,
   REGISTER_USER_REQUEST,
   REGISTER_USER_FAIL,
   USER_LOGOUT,
   UPDATE_USER_DETAILS_REQUEST,
   UPDATE_USER_DETAILS_SUCCESS,
   UPDATE_USER_DETAILS_FAIL,
   CHANGE_USER_LOGIN_REQUEST,
   CHANGE_USER_LOGIN_SUCCESS,
   CHANGE_USER_LOGIN_FAIL,
   FORGOT_PASSWORD_REQUEST,
   FORGOT_PASSWORD_SUCCESS,
   FORGOT_PASSWORD_FAIL,
   RESET_PASSWORD_REQUEST,
   RESET_PASSWORD_SUCCESS,
   RESET_PASSWORD_FAIL,
} from '../constants/userConstants';
import { server } from '../../config/server';
import { CLEAR_ERRORS } from '../constants/errorConstants';

// login a user
export const loginUser = (user) => async (dispatch) => {
   try {
      dispatch({ type: CLEAR_ERRORS });
      dispatch({ type: LOGIN_USER_REQUEST });

      const { data } = await axios.post(`${server}/api/auth`, user);

      dispatch({ type: LOGIN_USER_SUCCESS, payload: data });
      dispatch({ type: REGISTER_USER_SUCCESS, payload: data });

      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', JSON.stringify(data.token));
   } catch (err) {
      dispatch(returnErrors(err.response.data.msg));
      dispatch({ type: LOGIN_USER_FAIL });
   }
};

// register a user
export const registerUser = (user) => async (dispatch) => {
   try {
      dispatch({ type: CLEAR_ERRORS });
      dispatch({ type: REGISTER_USER_REQUEST });

      const { data } = await axios.post(`${server}/api/users`, user);

      dispatch({ type: REGISTER_USER_SUCCESS, payload: data });
      dispatch({ type: LOGIN_USER_SUCCESS, payload: data });

      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', JSON.stringify(data.token));
   } catch (err) {
      dispatch(returnErrors(err.response.data.msg));
      dispatch({ type: REGISTER_USER_FAIL });
   }
};

// Update user details
export const updateUser = (user) => async (dispatch, getState) => {
   try {
      dispatch({ type: CLEAR_ERRORS });
      dispatch({ type: UPDATE_USER_DETAILS_REQUEST });

      const { data } = await axios.put(
         `${server}/api/users`,
         user,
         tokenConfig(getState)
      );

      dispatch({ type: UPDATE_USER_DETAILS_SUCCESS, payload: data });
      dispatch({ type: REGISTER_USER_SUCCESS, payload: data });
      dispatch({ type: LOGIN_USER_SUCCESS, payload: data });

      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', JSON.stringify(data.token));
   } catch (err) {
      dispatch(returnErrors(err.response.data.msg));
      dispatch({ type: UPDATE_USER_DETAILS_FAIL });
   }
};

// Change login details
export const changeLogin = (passwords) => async (dispatch, getState) => {
   try {
      dispatch({ type: CLEAR_ERRORS });
      dispatch({ type: CHANGE_USER_LOGIN_REQUEST });

      const { data } = await axios.put(
         `${server}/api/users/passwords`,
         passwords,
         tokenConfig(getState)
      );

      dispatch({ type: CHANGE_USER_LOGIN_SUCCESS, payload: data });
      dispatch({ type: REGISTER_USER_SUCCESS, payload: data });
      dispatch({ type: LOGIN_USER_SUCCESS, payload: data });

      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', JSON.stringify(data.token));
   } catch (err) {
      dispatch(returnErrors(err.response.data.msg));
      dispatch({ type: CHANGE_USER_LOGIN_FAIL });
   }
};

// Forgot password
export const forgotPassword = (email) => (dispatch) => {
   dispatch({ type: CLEAR_ERRORS });
   dispatch({ type: FORGOT_PASSWORD_REQUEST });

   const config = {
      headers: {
         'Content-type': 'application/json',
      },
   };

   axios
      .post(`${server}/api/password-reset`, email, config)
      .then((res) => {
         dispatch({
            type: FORGOT_PASSWORD_SUCCESS,
            payload: res.data,
         });
      })
      .catch((err) => {
         dispatch(returnErrors(err.response.data.msg));
         dispatch({ type: FORGOT_PASSWORD_FAIL });
      });
};

export const resetPassword = (url, passwordObj) => (dispatch) => {
   dispatch({ type: CLEAR_ERRORS });
   dispatch({ type: RESET_PASSWORD_REQUEST });
   const config = {
      headers: {
         'Content-type': 'application/json',
      },
   };

   axios
      .post(url, passwordObj, config)
      .then((res) => {
         dispatch({
            type: RESET_PASSWORD_SUCCESS,
            payload: res.data,
         });
         dispatch(clearErrors());
      })
      .catch((err) => {
         dispatch(returnErrors(err.response.data.msg));
         dispatch({ type: RESET_PASSWORD_FAIL });
      });
};

// logout user
export const logout = () => async (dispatch) => {
   dispatch({ type: USER_LOGOUT });

   localStorage.removeItem('user');
   localStorage.removeItem('token');
};

export const tokenConfig = (getState) => {
   const token = getState().login.token;

   const config = {
      headers: {
         'Content-type': 'application/json',
      },
   };

   if (token) {
      config.headers['x-auth-token'] = token;
   }

   return config;
};
