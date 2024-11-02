export const { 
    saveTokens,
    saveAccessToken, 
    saveRefreshToken,
    getAccessToken, 
    getRefreshToken, 
    getAccessTokenExpiry,
    getRefreshTokenExpiry,
    isAccessTokenExpired, 
    isRefreshTokenExpired, 
    clearTokens 
} = window.electronAPI;