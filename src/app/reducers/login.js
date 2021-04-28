import { authLogin } from '../utils/authLogin';

const login = (state = { isLogin: false }, action) => {
  switch (action.type) {
    case 'LOGIN/LOGIN': {
      return { isLogin: authLogin(action.password) };
    }
    case 'LOGIN/LOGOUT': {
      return { isLogin: false }
    }
    default:
      return state;
  }
};

export default login;
