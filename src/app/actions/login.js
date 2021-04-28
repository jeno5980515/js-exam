export function submitPassword(password) {
  return {
    type: 'LOGIN/LOGIN',
    password
  };
}

export function logout() {
  return {
    type: 'LOGIN/LOGOUT'
  }
}