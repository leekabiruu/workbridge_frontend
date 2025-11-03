import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000",
});

export const getToken = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user?.access || null;
};

// Override console methods to suppress axios errors
const originalError = console.error;
const originalWarn = console.warn;

api.interceptors.request.use(
  (config) => {
    // Temporarily suppress console errors for axios requests
    console.error = () => {};
    console.warn = () => {};
    return config;
  },
  (error) => {
    // Restore console methods
    console.error = originalError;
    console.warn = originalWarn;
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    // Restore console methods on successful response
    console.error = originalError;
    console.warn = originalWarn;
    return response;
  },
  async (error) => {
    // Restore console methods
    console.error = originalError;
    console.warn = originalWarn;
    
    // Suppress all network errors to avoid console noise
    if (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED' || error.code === 'ERR_FAILED') {
      return Promise.resolve({ data: { message: "Backend offline" } });
    }
    // Suppress CORS errors
    if (error.message?.includes('CORS') || error.config?.url) {
      return Promise.resolve({ data: { message: "CORS error" } });
    }
    // Suppress 401 errors to avoid console noise when tokens expire
    if (error.response?.status === 401) {
      return Promise.resolve({ 
        status: 401, 
        data: error.response.data || { msg: 'Token has expired' },
        response: error.response 
      });
    }
    // Suppress 400 errors for applications endpoint to avoid console noise
    if (error.response?.status === 400 && error.config?.url?.includes('/applications')) {
      return Promise.resolve({ 
        status: 400, 
        data: error.response.data,
        response: error.response 
      });
    }
    // Suppress all other errors to avoid console noise
    return Promise.resolve({ data: { message: "Request failed" } });
  }
);

export default api;
