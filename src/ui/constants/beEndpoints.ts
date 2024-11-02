export const BASE_BE_ENDPOINT = 'http://localhost:8080';

export const REGISTER_ENDPOINT = '/auth/register';
export const LOGIN_ENDPOINT = '/auth/login';
export const REFRESH_ENDPOINT = '/auth/refresh';

export const NO_AUTH_APIS = [
    REGISTER_ENDPOINT, 
    LOGIN_ENDPOINT
];