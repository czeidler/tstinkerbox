const axios = require('axios');

export interface HTTPResponse {
  data: object;
  status: number;
  statusText: string;
  /** Response headers */
  headers: Record<string, string>;
}

export interface HTTPRequestConfig {
  /** HTTP headers */
  headers?: Record<string, string>;
  /** HTTP query parameters */
  params?: Record<string, string>;
}

export interface HTTP {
  /** HTTP GET request */
  get(url: string, config?: HTTPRequestConfig): Promise<HTTPResponse>;
  /** HTTP POST request */
  post(url: string, config?: HTTPRequestConfig): Promise<HTTPResponse>;
  put(url: string, config?: HTTPRequestConfig): Promise<HTTPResponse>;
  patch(url: string, config?: HTTPRequestConfig): Promise<HTTPResponse>;
  delete(url: string, config?: HTTPRequestConfig): Promise<HTTPResponse>;
  options(url: string, config?: HTTPRequestConfig): Promise<HTTPResponse>;
}

export const http: HTTP = {
  get: async (url: string, config?: HTTPRequestConfig) => {
    return axios.get(url, config);
  },
  post: async (url: string, config?: HTTPRequestConfig) => {
    return axios.post(url, config);
  },
  put: async (url: string, config?: HTTPRequestConfig) => {
    return axios.put(url, config);
  },
  patch: async (url: string, config?: HTTPRequestConfig) => {
    return axios.patch(url, config);
  },
  delete: async (url: string, config?: HTTPRequestConfig) => {
    return axios.delete(url, config);
  },
  options: async (url: string, config?: HTTPRequestConfig) => {
    return axios.options(url, config);
  },
}
