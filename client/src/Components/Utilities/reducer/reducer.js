import { parseJwt } from "../Helpers/Helper";

// check if user persists
function checkLocalUser() {
  const token = localStorage.getItem("Ajackus_user");

  if (token) {
    var tokenExp = new Date(0);
    tokenExp.setUTCSeconds(parseJwt(token).exp);
    if (Date.now() <= +tokenExp) {
      return token;
    } else {
      return null;
    }
  } else {
    return null;
  }
}

// Loading initialstate if localStorage item is present it returns token, if not present then returns null
export const initialState = {
  user: checkLocalUser(),
};

// action types
export const actionTypes = {
  SET_USER: "SET_USER",
};

// Reducer
export const reducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_USER:
      return {
        ...state,
        user: action.user,
      };

    default:
      return state;
  }
};
