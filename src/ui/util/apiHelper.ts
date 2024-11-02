import { TokenExpiredException } from '../exception/TokenExpiredException';
import { 
    getAccessToken, 
    saveAccessToken, 
    getRefreshToken, 
    isAccessTokenExpired, 
    isRefreshTokenExpired, 
    clearTokens 
} from './keyHelper'

import { 
    BASE_BE_ENDPOINT, 
    NO_AUTH_APIS, 
    REFRESH_ENDPOINT 
} from '../constants/beEndpoints';

export interface ApiResponse<T> {
    data?: T;
    status: number;
    errorCode?: string;
    message?: string;
}

const JSON_CONTENT_TYPE = 'application/json';

const refreshAccessToken = async (): Promise<string | null> => {
    const refreshToken = await getRefreshToken();
    if (!refreshToken || isRefreshTokenExpired()) {
        return null;
    }

    const response = await fetch(`${BASE_BE_ENDPOINT}${REFRESH_ENDPOINT}`, {
        method: 'POST',
        headers: {
            'Content-Type': JSON_CONTENT_TYPE,
            'Authorization': `Bearer ${refreshToken}`,
        },
    });

    if (response.ok) {
        const data = await response.json();
        const { token, expiresAt } = data;
        
        await saveAccessToken(token, new Date(expiresAt).getTime()); 
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
                'Content-Type': JSON_CONTENT_TYPE
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
                'Content-Type': JSON_CONTENT_TYPE,
                'Authorization': accessToken ? `Bearer ${accessToken}` : '',
            };
        }

        const response = await fetch(`${BASE_BE_ENDPOINT}${endpoint}`, {
            method,
            headers,
            body: body ? JSON.stringify(body) : undefined,
        });

        const status = response.status;
        const contentType = response.headers.get("Content-Type");

        let data;
        if (contentType && contentType.includes("application/json")) {
            data = await response.json();
        } else {
            data = await response.text();
        }

        if (response.ok) {
            return { data, status };
        } else {
            const errorMessage = typeof data === 'string' ? data : data.message;
            return { status, errorCode: data.errorCode, message: errorMessage };
        }
    } catch (error) {
        if (error instanceof TokenExpiredException) {
            console.error('Token expired, will handle redirection in component...');
            throw error;
        }
        console.error(error);
        return { status: 503, message: 'Errore di connessione. Controlla la tua connessione e riprova.' };
    }
};