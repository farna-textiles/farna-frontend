// eslint-disable-next-line import/no-extraneous-dependencies
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/',
  withCredentials: true,
});

export default api;
