import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi, registerApiListeners, storage } from "../services/api";
import { useToast } from "./ToastContext";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => storage.getUser());
  const [token, setToken] = useState(() => storage.getToken());
  const [isBootstrapping] = useState(false);
  const navigate = useNavigate();
  const { pushToast } = useToast();

  const logout = (message, shouldRedirect = true) => {
    storage.clearToken();
    storage.clearUser();
    setToken(null);
    setUser(null);
    if (message) {
      pushToast({ type: "info", title: "Signed out", message });
    }
    if (shouldRedirect) {
      navigate("/login", { replace: true });
    }
  };

  useEffect(() => {
    registerApiListeners({
      unauthorizedHandler: (message) =>
        logout(message || "Your session expired. Please sign in again."),
      apiErrorHandler: (message) =>
        pushToast({ type: "error", title: "Request failed", message }),
    });
  }, []);

  const login = async (credentials) => {
    const response = await authApi.login(credentials);
    const nextUser = {
      _id: response._id,
      name: response.name,
      email: response.email,
      role: response.role,
    };

    storage.setToken(response.token);
    storage.setUser(nextUser);
    setToken(response.token);
    setUser(nextUser);

    pushToast({
      type: "success",
      title: "Welcome back",
      message: `Signed in as ${nextUser.role}.`,
    });

    return nextUser;
  };

  const register = async (payload) => {
    const response = await authApi.register(payload);
    const nextUser = {
      _id: response._id,
      name: response.name,
      email: response.email,
      role: response.role,
    };

    storage.setToken(response.token);
    storage.setUser(nextUser);
    setToken(response.token);
    setUser(nextUser);

    pushToast({
      type: "success",
      title: "Account created",
      message: `Registered with ${nextUser.role} access.`,
    });

    return nextUser;
  };

  const value = useMemo(
    () => ({
      user,
      token,
      isBootstrapping,
      isAuthenticated: Boolean(token && user),
      login,
      register,
      logout,
    }),
    [user, token, isBootstrapping],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
