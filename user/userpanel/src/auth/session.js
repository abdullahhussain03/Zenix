const ROLE_KEY = "zenix_role"
const USER_KEY = "zenix_username"

export function getRole() {
  return sessionStorage.getItem(ROLE_KEY)
}

export function getUsername() {
  return sessionStorage.getItem(USER_KEY)
}

export function setSession(role, username) {
  sessionStorage.setItem(ROLE_KEY, role)
  sessionStorage.setItem(USER_KEY, username)
}

export function clearSession() {
  sessionStorage.removeItem(ROLE_KEY)
  sessionStorage.removeItem(USER_KEY)
}
