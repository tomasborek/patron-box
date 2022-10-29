import React, {
  useContext,
  createContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import jwt from "jsonwebtoken";
const AuthContext = createContext(null);
export const useAuth = () => {
  return useContext(AuthContext);
};

interface CurrentUser {
  id: number;
  name: string;
  email: string;
}
export default function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<null | CurrentUser>(null);
  const authChange = async () => {
    const token = localStorage.getItem("auth-token");
    if (token) {
      const { payload } = jwt.decode(token);
      return setCurrentUser(payload);
    }
    setCurrentUser(null);
  };
  useEffect(() => {
    authChange();
  }, []);

  const logIn = (token: string) => {
    localStorage.setItem("auth-token", token);
    authChange();
  };

  const logOut = () => {
    localStorage.removeItem("auth-token");
    authChange();
  };

  const value = {
    currentUser,
    logIn,
    logOut,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
