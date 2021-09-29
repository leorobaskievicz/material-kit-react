// Action Types

export const Types = {
  LOGIN: 'auth/LOGIN',
  LOGOUT: 'auth/LOGOUT'
};

// Reducer
const initialState = {
  isLogged: false,
  token: null,
  user: {}
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case Types.LOGIN:
      return { ...state, ...action.payload };
    case Types.LOGOUT:
      return initialState;
    default:
      return state;
  }
}

// Action Creators
export function login(username, password, token) {
  return {
    type: Types.LOGIN,
    payload: {
      isLogged: true,
      token,
      user: {
        usuario: username,
        senha: password
      }
    }
  };
}

export function logout() {
  return {
    type: Types.LOGOUT
  };
}
