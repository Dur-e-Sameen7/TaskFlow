import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    api("/tasks")
      .then(() => {
        setUser(
          JSON.parse(localStorage.getItem("user") || "null")
        );
      })
      .catch(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const saveAuth = (data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
  };

  const register = async (formData) => {
    const data = await api("/auth/register", {
      method: "POST",
      body: JSON.stringify(formData),
    });

    saveAuth(data);
    return data;
  };

  const login = async (formData) => {
    const data = await api("/auth/login", {
      method: "POST",
      body: JSON.stringify(formData),
    });

    saveAuth(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);