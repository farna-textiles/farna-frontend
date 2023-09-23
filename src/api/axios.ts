import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
  baseURL: import.meta.env.VITE_BE_URL,
  withCredentials: true,
});

api.defaults.headers.common['XSRF-TOKEN'] = Cookies.get('X-CSRF-Token');

export default api;
