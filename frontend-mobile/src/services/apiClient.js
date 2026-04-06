import { router } from 'expo-router';
import { API_BASE, getToken, clearToken } from './storage';

export class ApiError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

async function parseError(res) {
    try {
        const body = await res.json();
        const errors = body?.errors ?? body;
        if (typeof errors === 'object' && errors !== null) {
            const first = Object.values(errors)[0];
            return Array.isArray(first) ? first[0] : String(first);
        }
        return body?.detail ?? body?.message ?? 'Request failed';
    } catch {
        return 'Request failed';
    }
}

async function request(method, path, body = null, isMultipart = false) {
    const token = await getToken();
    const headers = {
        Accept: 'application/json',
    };

    if (token) headers['Authorization'] = `Token ${token}`;
    if (!isMultipart) headers['Content-Type'] = 'application/json';

    // Timeout logic: automatically abort fetch if it takes too long
    // This prevents the app from "spinning forever" if the IP is unreachable.
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000000); // 30 seconds

    try {
        const res = await fetch(`${API_BASE}${path}`, {
            method,
            headers,
            body: body ? (isMultipart ? body : JSON.stringify(body)) : undefined,
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (res.status === 401) {
            await clearToken();
            router.replace('/login');
            throw new ApiError('Unauthorized', 401);
        }

        if (!res.ok) {
            const msg = await parseError(res);
            throw new ApiError(msg, res.status);
        }

        const text = await res.text();
        return text ? JSON.parse(text) : {};

    } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
            throw new ApiError(`Connection timeout.\nMake sure Django is running, and API_BASE (${API_BASE}) matches your PC's IP if you are on a phone.`, 0);
        }
        if (error.message.includes('Network request failed')) {
            throw new ApiError(`Network error!\nUpdate API_BASE in storage.js to your PC's Wi-Fi IP if you are testing on your phone.`, 0);
        }
        throw error;
    }
}

export const api = {
    get: (path) => request('GET', path),
    post: (path, body) => request('POST', path, body),
    patch: (path, body) => request('PATCH', path, body),
    patchForm: (path, body) => request('PATCH', path, body, true),
};
