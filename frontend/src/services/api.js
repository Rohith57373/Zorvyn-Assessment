import axios from "axios";

const TOKEN_KEY = "finance_dashboard_token";
const USER_KEY = "finance_dashboard_user";

let onUnauthorized = null;
let onApiError = null;

export const storage = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  setToken: (token) => localStorage.setItem(TOKEN_KEY, token),
  clearToken: () => localStorage.removeItem(TOKEN_KEY),
  getUser: () => {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  },
  setUser: (user) => localStorage.setItem(USER_KEY, JSON.stringify(user)),
  clearUser: () => localStorage.removeItem(USER_KEY),
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = storage.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Something went wrong while contacting the API.";

    if (error.response?.status === 401 && onUnauthorized) {
      onUnauthorized(message);
    } else if (onApiError) {
      onApiError(message);
    }

    return Promise.reject(error);
  },
);

export const registerApiListeners = ({ unauthorizedHandler, apiErrorHandler }) => {
  onUnauthorized = unauthorizedHandler;
  onApiError = apiErrorHandler;
};

export const authApi = {
  login: async (credentials) => {
    const { data } = await api.post("/auth/login", credentials);
    return data;
  },
  register: async (payload) => {
    const { data } = await api.post("/auth/register", payload);
    return data;
  },
  updatePassword: async (payload) => {
    const { data } = await api.put("/auth/profile/password", payload);
    return data;
  },
};

export const dashboardApi = {
  getSummary: async () => {
    const { data } = await api.get("/dashboard/summary");
    return data;
  },
  getTrends: async () => {
    const { data } = await api.get("/dashboard/trends");
    return data;
  },
  getCategoryBreakdown: async () => {
    const { data } = await api.get("/dashboard/category-breakdown");
    return data;
  },
};

export const recordsApi = {
  getRecords: async (params) => {
    const { data } = await api.get("/records", { params });
    return data;
  },
  createRecord: async (payload) => {
    const { data } = await api.post("/records", payload);
    return data;
  },
  updateRecord: async (id, payload) => {
    const { data } = await api.put(`/records/${id}`, payload);
    return data;
  },
  deleteRecord: async (id) => {
    const { data } = await api.delete(`/records/${id}`);
    return data;
  },
};

export const usersApi = {
  getUsers: async () => {
    const { data } = await api.get("/users");
    return data;
  },
  createUser: async (payload) => {
    const { data } = await api.post("/users", payload);
    return data;
  },
  updateRole: async (id, role) => {
    const { data } = await api.put(`/users/${id}/role`, { role });
    return data;
  },
  updateStatus: async (id, isActive) => {
    const { data } = await api.put(`/users/${id}/status`, { isActive });
    return data;
  },
};

export default api;
