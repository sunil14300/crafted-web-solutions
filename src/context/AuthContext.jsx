import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("seva_token"));
  const [worker, setWorker] = useState(() => {
    const saved = localStorage.getItem("seva_worker");
    return saved ? JSON.parse(saved) : null;
  });

  const login = (tokenValue, workerData) => {
    localStorage.setItem("seva_token", tokenValue);
    localStorage.setItem("seva_worker", JSON.stringify(workerData));
    setToken(tokenValue);
    setWorker(workerData);
  };

  const logout = () => {
    localStorage.removeItem("seva_token");
    localStorage.removeItem("seva_worker");
    setToken(null);
    setWorker(null);
  };

  return (
    <AuthContext.Provider value={{ token, worker, isLoggedIn: !!token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
