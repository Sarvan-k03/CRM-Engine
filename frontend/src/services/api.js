import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

let authLogout = null;
let redirectToLogin = null;

export const setAuthHandlers = ({ logout, redirect }) => {
  authLogout = logout;
  redirectToLogin = redirect;
};

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      authLogout?.();
      redirectToLogin?.('/login');
    }

    return Promise.reject(error);
  }
);

export default API;