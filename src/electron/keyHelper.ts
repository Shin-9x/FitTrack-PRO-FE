import keytar from 'keytar';
import Store from 'electron-store';

export const SERVICE_NAME = 'FitTrackerPRO';
export const USER_ACCESS_TOKEN = 'userAccessToken';
export const USER_REFRESH_TOKEN = 'userRefreshToken';
export const EXPIRATION_ACCESS_TOKEN = 'expirationAccessToken';
export const EXPIRATION_REFRESH_TOKEN = 'expirationRefreshToken';

// Crea un'istanza di Store
const store = new Store();

/**
 * Salva l'access token e la data di scadenza.
 * @param accessToken - Access JWT token da salvare.
 * @param expiresAt - Timestamp di scadenza del token
 */
export async function saveAccessToken(accessToken: string, expiresAt: number): Promise<void> {
    await keytar.setPassword(SERVICE_NAME, USER_ACCESS_TOKEN, accessToken);
    store.set(EXPIRATION_ACCESS_TOKEN, expiresAt);
}

/**
 * Salva il refresh token e la data di scadenza.
 * @param refreshToken - Refresh JWT token da salvare.
 * @param expiresAt - Timestamp di scadenza del token
 */
export async function saveRefreshToken(refreshToken: string, expiresAt: number): Promise<void> {
    await keytar.setPassword(SERVICE_NAME, USER_REFRESH_TOKEN, refreshToken);
    store.set(EXPIRATION_REFRESH_TOKEN, expiresAt);
}

/**
 * Recupera l'access token
 * @returns {Promise<string | null>} - L'access token salvato o null se non trovato.
 */
export async function getAccessToken(): Promise<string | null> {
    return await keytar.getPassword(SERVICE_NAME, USER_ACCESS_TOKEN);
}

/**
 * Recupera il refresh token
 * @returns {Promise<string | null>} - Il refresh token salvato o null se non trovato.
 */
export async function getRefreshToken(): Promise<string | null> {
    return await keytar.getPassword(SERVICE_NAME, USER_REFRESH_TOKEN);
}

/**
 * Recupera la data di scadenza dell'access token.
 * @returns {number | null} - Timestamp della scadenza o null se non trovato.
 */
export function getAccessTokenExpiry(): number | null {
    const expiry = store.get(EXPIRATION_ACCESS_TOKEN);
    return typeof expiry === 'number' ? expiry : null;
}

/**
 * Recupera la data di scadenza del refresh token.
 * @returns {number | null} - Timestamp della scadenza o null se non trovato.
 */
export function getRefreshTokenExpiry(): number | null {
    const expiry = store.get(EXPIRATION_REFRESH_TOKEN);
    return typeof expiry === 'number' ? expiry : null;
}

/**
 * Rimuove l'access token, il refresh token, e la data di scadenza.
 */
export async function clearTokens(): Promise<void> {
    await keytar.deletePassword(SERVICE_NAME, USER_ACCESS_TOKEN);
    await keytar.deletePassword(SERVICE_NAME, USER_REFRESH_TOKEN);
    store.delete(EXPIRATION_ACCESS_TOKEN);
    store.delete(EXPIRATION_REFRESH_TOKEN);
}

/**
 * Controlla se l'access token è scaduto.
 * @returns {boolean} - True se il token è scaduto o non è presente.
 */
export function isAccessTokenExpired(): boolean {
    const expiresAt = getAccessTokenExpiry();
    return expiresAt ? Date.now() >= expiresAt : true;
}

/**
 * Controlla se il refresh token è scaduto.
 * @returns {boolean} - True se il token è scaduto o non è presente.
 */
export function isRefreshTokenExpired(): boolean {
    const expiresAt = getRefreshTokenExpiry();
    return expiresAt ? Date.now() >= expiresAt : true;
}

/**
 * Salva l'access token, il refresh token e le loro date di scadenza.
 * @param accessToken - L'access token ricevuto dal server.
 * @param refreshToken - Il refresh token ricevuto dal server.
 * @param expiryAccessToken - Timestamp di scadenza dell'access token.
 * @param expiryRefreshToken - Timestamp di scadenza del refresh token.
 */
export async function saveTokens(accessToken: string, refreshToken: string, expiryAccessToken: number, expiryRefreshToken: number): Promise<void> {
    await saveAccessToken(accessToken, expiryAccessToken);
    await saveRefreshToken(refreshToken, expiryRefreshToken);
}