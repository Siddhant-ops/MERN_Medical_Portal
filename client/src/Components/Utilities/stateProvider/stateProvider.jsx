import { createContext, useContext, useReducer } from "react";

export const stateContext = createContext();

// A simple state provider to all the children in the app tree
export const StateProvider = ({ reducer, initialState, children }) => (
  <stateContext.Provider value={useReducer(reducer, initialState)}>
    {children}
  </stateContext.Provider>
);

export const useStateValue = () => useContext(stateContext);
