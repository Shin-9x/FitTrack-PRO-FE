export {};

declare global {
    interface Window {
        electronAPI: {
            saveTokens: (accessToken: string, refreshToken: string, expiryAccessToken: number, expiryRefreshToken: number) => Promise<void>
            saveAccessToken: (accessToken: string, expiresAt: number) => Promise<void>;
            saveRefreshToken: (refreshToken: string, expiresAt: number) => Promise<void>;
            getAccessToken: () => Promise<string | null>;
            getRefreshToken: () => Promise<string | null>;
            getAccessTokenExpiry: () => Promise<number | null>;
            getRefreshTokenExpiry: () => Promise<number | null>;
            isAccessTokenExpired: () => boolean;
            isRefreshTokenExpired: () => boolean;
            clearTokens: () => Promise<void>;
        };
    }
}