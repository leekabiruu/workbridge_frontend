import axios from "axios";


const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api", 
});


export const getToken = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user?.access || null;
};

api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.code === "ERR_NETWORK" || error.code === "ECONNREFUSED") {
      console.warn("Backend server not running. Please start the backend.");
      return Promise.resolve({ data: { message: "Backend offline" } });
    }
    if (error.response?.status === 401) {
      console.warn("Unauthorized! Token may have expired.");
    }
    return Promise.reject(error);
  }
);

export default api;
