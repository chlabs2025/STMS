/**
 * Centralized Auth Helper
 * Single source of truth for login state + localStorage keys
 */

const KEYS = {
    TOKEN: "accessToken",
    REFRESH_TOKEN: "refreshToken",
    ROLE: "role",
    IS_LOGGED_IN: "isLoggedIn",
    USERNAME: "username",
};

// ─── Setters ──────────────────────────────────────────────────────────────────

export const saveAuth = ({ accessToken, refreshToken, user }) => {
    localStorage.setItem(KEYS.TOKEN, accessToken);
    localStorage.setItem(KEYS.REFRESH_TOKEN, refreshToken);
    localStorage.setItem(KEYS.ROLE, user.role);
    localStorage.setItem(KEYS.USERNAME, user.username);
    localStorage.setItem(KEYS.IS_LOGGED_IN, "true");
};

export const clearAuth = () => {
    Object.values(KEYS).forEach((key) => localStorage.removeItem(key));
};

// ─── Getters ──────────────────────────────────────────────────────────────────

export const getToken = () => localStorage.getItem(KEYS.TOKEN);
export const getRefreshToken = () => localStorage.getItem(KEYS.REFRESH_TOKEN);
export const getRole = () => localStorage.getItem(KEYS.ROLE);
export const getUsername = () => localStorage.getItem(KEYS.USERNAME);
export const isLoggedIn = () => localStorage.getItem(KEYS.IS_LOGGED_IN) === "true";

export default {
    saveAuth,
    clearAuth,
    getToken,
    getRefreshToken,
    getRole,
    getUsername,
    isLoggedIn,
    KEYS,
};
