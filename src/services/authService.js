import http from './httpService';
import config from '../config.json';
const { apiUrl } = config;
const apiEndpoint = `${apiUrl}/auth`;
import Cookies from 'js-cookie';

async function login(user) {
    return await http.post(`${apiEndpoint}/login`, user);
}

async function register(user) {
    return http.post(`${apiEndpoint}/register`, user);
}

function storeLoginData(data) {
    // Validate and sanitize user data before storing it in cookies
    const sanitizedToken = sanitizeInput(data.token);
    const sanitizedUser = sanitizeInput(JSON.stringify(data.user));

    // Set the token in a cookie with appropriate domain and path
    Cookies.set('token', sanitizedToken, { domain: 'localhost', path: '/' });

    // Set the user data in a separate cookie with appropriate domain and path
    Cookies.set('user', sanitizedUser, { domain: 'localhost', path: '/' });
}

function sanitizeInput(input) {
    return input.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function getCurrentUser() {
    try {
        const userString = Cookies.get('user');
        if (userString) {
            return JSON.parse(userString);
        }
        return null;
    } catch (ex) {
        console.error('Error parsing user from cookie:', ex);
        return null;
    }
}

function getJwt() {
    return Cookies.get('token');
}

async function logout(userId) {
    localStorage.removeItem(authTokenKey);
    localStorage.removeItem(accessTokenKey);
    localStorage.removeItem(userData);
    localStorage.removeItem(userRole);
    return await http.post(`${apiEndpoint}/logout`, { userId });
}

export default {
    login,
    register,
    storeLoginData,
    logout,
    getCurrentUser,
    getJwt,
};
