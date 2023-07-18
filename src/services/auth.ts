// eslint-disable-next-line import/no-extraneous-dependencies
import axios from 'axios';

const authService = {
  login: async (identifier: string, password: string) => {
    const response = await axios.post('/auth/signin', {
      identifier,
      password,
    });
    return response.data;
  },

  register: async (
    username: string,
    email: string,
    password: string,
    invitationToken: string | null = null
  ) => {
    const response = await axios.post('/auth/signup', {
      username,
      email,
      password,
      invitationToken,
    });
    return response.data;
  },
};

export default authService;
