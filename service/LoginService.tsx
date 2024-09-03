import axios from 'axios';
import BaseService from './BaseService';

interface TokenType {
  token?: string;
}

const APP_API_URL = process.env.NEXT_PUBLIC_APP_API_URL;

export default class LoginService extends BaseService {
  static async login(userName: string, psw: string) {
    return axios.post<TokenType>(
      `${APP_API_URL}/auth/login`,
      {},
      {
        auth: {
          username: userName,
          password: psw,
        },
        withCredentials: true,
      },
    );
  }

  static async logOut() {
    const logout = await axios.post(
      `${APP_API_URL}/auth/logout`,
      {},
      {
        withCredentials: true,
      },
    );
    return logout.data;
  }

  static async getCurrentUser() {
    const userProfile = await axios.get(`${APP_API_URL}/users/current`, {
      withCredentials: true,
    });

    return userProfile.data || null;
  }
}
