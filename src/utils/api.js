import axios from 'axios';

const apiAxio = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
  }
});

class Api {
  // eslint-disable-next-line class-methods-use-this
  async get(url, token) {
    try {
      const headers = {};
      headers.Accept = 'application/json';
      headers['Access-Control-Allow-Origin'] = '*';

      if (token) headers.Authorization = ` Bearer ${token}`;

      return apiAxio.get(url, { headers });
    } catch (e) {
      console.error('api (ERROR): ', e);
      return false;
    }
  }

  // eslint-disable-next-line class-methods-use-this
  async post(url, body, token, noTimeout) {
    try {
      if (noTimeout === true) {
        apiAxio.defaults.timeout = 1000 * 60 * 60; // 60 segundos * 60 minutos = 1 hora
      } else {
        apiAxio.defaults.timeout = 1000 * 60 * 1; // 60 segundos * 1 minutos = 1 minuto
      }

      const headers = {};
      headers['Content-Type'] = 'application/json';
      headers.Accept = 'application/json';
      headers['Access-Control-Allow-Origin'] = '*';

      if (token != null) headers.Authorization = ` Bearer ${token}`;

      const bodyEnd = {
        ...body,
        HTTP_X_AUTH_TOKEN:
          'fGtaUSg0Q2J8MC9XU2UxNSo4JnJ6c2JiT2hZe2JXaWMyNFVXdlZ7X3F2OG9iNDxYbG1LR3VeK0A8JD02UDtp'
      };

      return apiAxio.post(url, bodyEnd, { headers });
    } catch (e) {
      console.error('api (ERROR): ', e);
      return false;
    }
  }

  // eslint-disable-next-line class-methods-use-this
  async postFile(url, body, token) {
    try {
      const headers = {};
      headers['Content-Type'] = 'multipart/form-data';
      headers.Accept = 'application/json';
      headers['Access-Control-Allow-Origin'] = '*';

      if (token != null) headers.Authorization = ` Bearer ${token}`;

      return apiAxio.post(url, body, { headers });
    } catch (e) {
      console.error('api (ERROR): ', e);
      return false;
    }
  }

  // eslint-disable-next-line class-methods-use-this
  async put(url, body, token) {
    try {
      const headers = {};
      headers['Content-Type'] = 'application/json';
      headers.Accept = 'application/json';
      headers['Access-Control-Allow-Origin'] = '*';

      if (token != null) headers.Authorization = ` Bearer ${token}`;

      const bodyEnd = {
        ...body,
        HTTP_X_AUTH_TOKEN:
          'fGtaUSg0Q2J8MC9XU2UxNSo4JnJ6c2JiT2hZe2JXaWMyNFVXdlZ7X3F2OG9iNDxYbG1LR3VeK0A8JD02UDtp'
      };

      return apiAxio.put(url, bodyEnd, { headers });
    } catch (e) {
      console.error('api (ERROR): ', e);
      return false;
    }
  }

  // eslint-disable-next-line class-methods-use-this
  async delete(url, token) {
    try {
      const headers = {};
      headers.Accept = 'application/json';
      headers['Access-Control-Allow-Origin'] = '*';

      if (token != null) headers.Authorization = ` Bearer ${token}`;

      return apiAxio.delete(url, { headers });
    } catch (e) {
      console.error('api (ERROR): ', e);
      return false;
    }
  }
}

export default Api;
