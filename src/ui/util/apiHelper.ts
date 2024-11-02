import { TokenExpiredException } from '../exception/TokenExpiredException';
import { getAccessToken, saveAccessToken, getRefreshToken, isAccessTokenExpired, isRefreshTokenExpired, clearTokens } from './keyHelper'

const BASE_URL = 'http://localhost:8080';

export interface ApiResponse<T> {
    data?: T;
    status: number;
    errorCode?: string;
    message?: string;
}

const NO_AUTH_APIS = [
    '/auth/register', '/auth/login'
];

const REFRESH_API = '/auth/refresh';

const refreshAccessToken = async (): Promise<string | null> => {
    const refreshToken = await getRefreshToken();
    if (!refreshToken || isRefreshTokenExpired()) {
        return null;
    }

    const response = await fetch(`${BASE_URL}${REFRESH_API}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${refreshToken}`,
        },
    });

    if (response.ok) {
        const data = await response.json();
        const { token, expiresAt } = data;
        
        await saveAccessToken(token, new Date(expiresAt).getTime()); // Salva la scadenza come timestamp
        return token; 
    }

    return null;
};

export const apiRequest = async <T>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'POST',
    body?: object
): Promise<ApiResponse<T>> => {
    try {
        let headers = {};
        let accessToken: string | null = null;

        if (NO_AUTH_APIS.includes(endpoint)) {
            headers = {
                'Content-Type': 'application/json'
            };
        } else {
            if (isAccessTokenExpired()) {
                const newAccessToken = await refreshAccessToken();
                
                if (newAccessToken) {
                    accessToken = newAccessToken;
                } else {
                    await clearTokens();
                    throw new TokenExpiredException('Both access and refresh tokens have expired.');
                }
            } else {
                accessToken = await getAccessToken();
            }

            headers = {
                'Content-Type': 'application/json',
                'Authorization': accessToken ? `Bearer ${accessToken}` : '',
            };
        }

        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method,
            headers,
            body: body ? JSON.stringify(body) : undefined,
        });

        const data = await response.json();
        const status = response.status;

        if (response.ok) {
            return { data, status };
        } else {
            return { status, errorCode: data.errorCode, message: data.message };
        }
    } catch (error) {
        if (error instanceof TokenExpiredException) {
            console.error('Token expired, will handle redirection in component...');
            throw error;
        }
        console.error(error);
        return { status: 500, message: 'Errore di connessione. Controlla la tua connessione e riprova.' };
    }
};