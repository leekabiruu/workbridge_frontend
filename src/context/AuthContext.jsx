import { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

 
  useEffect(() => {
    const requestInterceptor = api.interceptors.request.use(
      (config) => {
        if (user?.access) {
          config.headers = config.headers || {};
          config.headers.Authorization = `Bearer ${user.access}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    return () => {
      api.interceptors.request.eject(requestInterceptor);
    };
  }, [user]);

  // Login function
  const login = async (emailOrUsername, password, role) => {
    setLoading(true);
    try {
      const res = await api.post("/auth/login", {
        username: emailOrUsername,
        password,
        role,
      });
      const data = res.data;
      setUser({
        ...data.user,
        access: data.access_token,
        refresh: data.refresh_token,
      });
      setLoading(false);
      return { success: true };
    } catch (err) {
      console.error(err);
      setLoading(false);
      return {
        success: false,
        message: err.response?.data?.message || "Login failed",
      };
    }
  };

  // Signup function
  const signup = async (form) => {
    setLoading(true);
    try {
      const res = await api.post("/auth/register", form);
      const { email } = res.data;
      // Auto-login after signup
      const loginRes = await login(email, form.password, form.role);
      setLoading(false);
      return loginRes;
    } catch (err) {
      console.error(err);
      setLoading(false);
      return {
        success: false,
        message: err.response?.data?.message || "Signup failed",
      };
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
