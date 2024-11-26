"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useCart } from "./CartContext";

type UserContextType = {
  firstInitial: string;
  isAuthenticated: boolean;
  login: (userID: string) => void;
  logout: () => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [firstInitial, setFirstInitial] = useState<string>("");
  const { setCart } = useCart();

  // Fetch user information (e.g., first initial)
  const fetchUser = async (userID: string) => {
    try {
      const response = await fetch(`/api/user/${userID}`);
      const user = await response.json();
      if (user) setFirstInitial(user.firstName.charAt(0).toUpperCase());
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  // On initial mount, check authentication and fetch user info
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userID = localStorage.getItem("userID");
    if (token && userID) {
      setIsAuthenticated(true);
      fetchUser(userID); // Fetch the user only if userID exists
    }
  }, []);

  const login = (userID: string) => {
    // Save userID in localStorage for persistence
    localStorage.setItem("userID", userID);

    // Set authenticated state
    setIsAuthenticated(true);

    // Fetch the user data immediately
    fetchUser(userID);
  };

  const logout = () => {
    localStorage.clear();
    setCart([]);
    setIsAuthenticated(false);
    setFirstInitial("");
  };

  // Memoize context value to avoid unnecessary re-renders
  const value = useMemo(
    () => ({ firstInitial, isAuthenticated, login, logout }),
    [firstInitial, isAuthenticated]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
