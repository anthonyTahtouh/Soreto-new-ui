/* eslint-disable no-restricted-syntax */
import axios from 'axios';

const APP_API_URL = process.env.NEXT_PUBLIC_APP_API_URL;

export default class BaseService {
  /**
   * This is the basic get function
   * @param endpoint
   * @param query
   * @returns
   */
  static get(endpoint: string, query?: string, params?: any) {
    return axios.get(`${APP_API_URL}/${endpoint}${query}`, {
      withCredentials: true,
      params,
    });
  }

  /**
   * This is the basic post function
   * @param endpoint
   * @param body
   * @returns
   */
  static post(endpoint: string, body?: any) {
    return axios.post(`${APP_API_URL}/${endpoint}`, body, {
      withCredentials: true,
    });
  }

  /**
   * This is the basic put function
   * @param endpoint
   * @param body
   * @returns
   */
  static put(endpoint: string, body?: any) {
    return axios.put(`${APP_API_URL}/${endpoint}`, body, {
      withCredentials: true,
    });
  }

  /**
   * This is the basic delete function
   * @param endpoint
   * @returns
   */
  static delete(endpoint: string) {
    return axios.delete(`${APP_API_URL}/${endpoint}`, {
      withCredentials: true,
    });
  }
}
