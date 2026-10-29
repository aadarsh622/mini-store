import { tokenService } from './token.service.js';

// Normalize so both "https://host" and "https://host/api" work in Vercel env.
function resolveApiBaseUrl(raw) {
  const fallback = 'http://localhost:5000/api';
  const value = (raw || fallback).trim().replace(/\/+$/, '');
  return value.endsWith('/api') ? value : `${value}/api`;
}

const API_URL = resolveApiBaseUrl(import.meta.env.VITE_API_URL);

class ApiClient {
  constructor() {
    this.baseURL = API_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = tokenService.get();
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
      credentials: 'include',
      ...options,
    };

    if (options.body && typeof options.body === 'object') {
      config.body = JSON.stringify(options.body);
    }

    try {
      const response = await fetch(url, config);
      let data;
      try {
        data = await response.json();
      } catch {
        data = { message: response.statusText || 'Server error' };
      }

      if (!response.ok) {
        const error = new Error(data.message || 'Request failed');
        error.status = response.status;
        throw error;
      }

      return data;
    } catch (error) {
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new Error(
          'Unable to connect to the API. Check that the backend is running and VITE_API_URL is set.',
          { cause: error }
        );
      }
      throw error;
    }
  }

  get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  post(endpoint, body) {
    return this.request(endpoint, { method: 'POST', body });
  }

  put(endpoint, body) {
    return this.request(endpoint, { method: 'PUT', body });
  }

  upload(endpoint, formData) {
    const url = `${this.baseURL}${endpoint}`;
    const token = tokenService.get();
    const config = {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      credentials: 'include',
      body: formData,
    };

    return fetch(url, config).then(async (response) => {
      let data;
      try {
        data = await response.json();
      } catch {
        data = { message: response.statusText || 'Server error' };
      }

      if (!response.ok) {
        const error = new Error(data.message || 'Upload failed');
        error.status = response.status;
        throw error;
      }

      return data;
    });
  }

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

export function getImageUrl(imagePath) {
  if (!imagePath) return '';
  if (
    imagePath.startsWith('http://') ||
    imagePath.startsWith('https://') ||
    imagePath.startsWith('data:') ||
    imagePath.startsWith('blob:')
  ) {
    return imagePath;
  }
  const serverOrigin = API_URL.replace(/\/api\/?$/, '');
  return `${serverOrigin}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
}

export const api = new ApiClient();
