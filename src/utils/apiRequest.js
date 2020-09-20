import axios from 'axios'
import { API_URL } from '../config/types'

function headers() {
  return {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${process.env.VUE_APP_AUTH_TOKEN}`
    }
  }
}

function headersAuth() {
  return {
    headers: {
      'Content-Type': 'multipart/form-data',
      // 'Accept': 'multipart/form-data',
      'Authorization': `Bearer ${process.env.VUE_APP_AUTH_TOKEN}`
    }
  }
}

const request = (callback) => {
  return new Promise((resolve, reject) => {
    callback
      .then(data => resolve(data))
      .catch(e => reject(handleError(e)));
  })
}

const handleError = (e) => {
  if (!e.response) return { _e: 'Unknown Error' };
  return e;
}

export default class apiRequest {
  static get(path) {
    return request(axios.get(`${API_URL}/${path}`, headers()));
  }

  static getPublic(path) {
    return request(axios.get(`${API_URL}/${path}`));
  }

  static post(path, data) {
    return request(axios.post(`${API_URL}/${path}`, data, headers()));
  }

  static patch(path, data) {
    return request(axios.patch(`${API_URL}/${path}`, data, headers()));
  }

  static delete(path) {
    return request(axios.delete(`${API_URL}/${path}`, headers()));
  }

  static put(path, data) {
    return request(axios.put(`${API_URL}/${path}`, data));
  }

  static postFormData(path,data) {
    return request(axios.post(`${API_URL}/${path}`, data, headersAuth()));
  }

  static putJson(path, data) {
    return request(axios.put(`${API_URL}/${path}`, data, headers()));
  }
}
