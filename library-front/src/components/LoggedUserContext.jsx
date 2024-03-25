import React, { createContext, useContext, useReducer, useEffect } from "react";
import loggedUserReducer, { initialState } from "./LoggedUserReducer";

const LoggedUserContext = createContext();

export const LoggedUserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(loggedUserReducer, initialState);

  useEffect(() => {
    const savedUser = localStorage.getItem("booksAppUserToken");
    if (savedUser) {
      dispatch({ type: "SET_USER", payload: savedUser });
    }
  }, []);

  /*   useEffect(() => {
    localStorage.setItem("booksAppUserToken", state.user);
  }, [state.user]); */

  return (
    <LoggedUserContext.Provider value={{ state, dispatch }}>
      {children}
    </LoggedUserContext.Provider>
  );
};

export const useLoggedUser = () => useContext(LoggedUserContext);
