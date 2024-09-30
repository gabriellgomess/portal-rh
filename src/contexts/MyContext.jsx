import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const MyContext = createContext();

// Define the base URL
const Axios = axios.create({
  baseURL: `${import.meta.env.VITE_REACT_APP_URL}/api/login/`,
});

const MyContextProvider = ({ children }) => {
  const [showLogin, setShowLogin] = useState(true);
  const [isAuth, setIsAuth] = useState(false);
  const [theUser, setTheUser] = useState(null);

  useEffect(() => {
    isLoggedIn();
  }, []);


  const toggleNav = () => {
    setShowLogin(!showLogin);
  };

  const logoutUser = () => {
    localStorage.removeItem("loginToken");
    setIsAuth(false);
  };

  const registerUser = async (user) => {
    const register = await Axios.post("register.php", {
      name: user.name,
      email: user.email,
      password: user.password,
    });
    return register.data;
  };

  const loginUser = async (user) => {
    const login = await Axios.post("login.php", {
      email: user.email,
      password: user.password,
    });
    return login.data;
  };

  const isLoggedIn = async () => {
    const loginToken = localStorage.getItem("loginToken");
    if (loginToken) {
      Axios.defaults.headers.common["Authorization"] = "bearer " + loginToken;
      const { data } = await Axios.get("user-info.php");
      if (data.success && data.user) {
        setIsAuth(true);
        setTheUser(data.user);
      }
    }
  };

  const contextValue = {
    rootState: { showLogin, isAuth, theUser },
    toggleNav,
    isLoggedIn,
    registerUser,
    loginUser,
    logoutUser,
  };

  return (
    <MyContext.Provider value={contextValue}>
      {children}
    </MyContext.Provider>
  );
};

export default MyContextProvider;
