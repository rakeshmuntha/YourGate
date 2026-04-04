import axios from 'axios';

// ── Token storage ──
const TOKEN_KEY = 'yourgate_access_token';
const REFRESH_KEY = 'yourgate_refresh_token';

export const tokenStore = {
    getAccess: () => localStorage.getItem(TOKEN_KEY),
    getRefresh: () => localStorage.getItem(REFRESH_KEY),
    set: (access: string, refresh: string) => {
        localStorage.setItem(TOKEN_KEY, access);
        localStorage.setItem(REFRESH_KEY, refresh);
    },
    clear: () => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(REFRESH_KEY);
    },
};

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api',
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' },
});

// ── Request interceptor: attach Bearer token ──
api.interceptors.request.use((config) => {
    const token = tokenStore.getAccess();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// ── Response interceptor: refresh on 401 ──
let isRefreshing = false;
let failedQueue: { resolve: (token: string) => void; reject: (err: any) => void }[] = [];

const processQueue = (error: any, token: string | null) => {
    failedQueue.forEach((p) => {
        if (token) p.resolve(token);
        else p.reject(error);
    });
    failedQueue = [];
};

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status !== 401 || originalRequest._retry) {
            return Promise.reject(error);
        }

        // Don't try to refresh if already on auth endpoints
        if (originalRequest.url?.includes('/auth/login') ||
            originalRequest.url?.includes('/auth/refresh') ||
            originalRequest.url?.includes('/auth/register')) {
            return Promise.reject(error);
        }

        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({
                    resolve: (token: string) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        resolve(api(originalRequest));
                    },
                    reject,
                });
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        const refreshToken = tokenStore.getRefresh();
        if (!refreshToken) {
            isRefreshing = false;
            tokenStore.clear();
            return Promise.reject(error);
        }

        try {
            const res = await axios.post(
                `${api.defaults.baseURL}/auth/refresh`,
                { refreshToken },
                { headers: { 'Content-Type': 'application/json' } }
            );
            const { accessToken, refreshToken: newRefresh } = res.data;
            tokenStore.set(accessToken, newRefresh);
            processQueue(null, accessToken);
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return api(originalRequest);
        } catch (refreshError) {
            processQueue(refreshError, null);
            tokenStore.clear();
            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    }
);

// Auth
export const authAPI = {
    login: (data: { email: string; password: string }) => api.post('/auth/login', data),
    register: (data: any) => api.post('/auth/register', data),
    logout: () => api.post('/auth/logout'),
    getMe: () => api.get('/auth/me'),
    updateProfile: (data: { name?: string; flatNumber?: string }) => api.patch('/auth/profile', data),
};

// Community
export const communityAPI = {
    register: (data: any) => api.post('/community/register', data),
    getApproved: () => api.get('/community/approved'),
    getAll: () => api.get('/community/all'),
    approve: (id: string) => api.patch(`/community/approve/${id}`),
    reject: (id: string) => api.patch(`/community/reject/${id}`),
};

// Admin
export const adminAPI = {
    getPendingUsers: () => api.get('/admin/pending-users'),
    approveUser: (id: string) => api.patch(`/admin/approve-user/${id}`),
    rejectUser: (id: string) => api.patch(`/admin/reject-user/${id}`),
    getUsers: () => api.get('/admin/users'),
    addFaculty: (data: { name: string; email: string; role: string }) =>
        api.post('/admin/faculty', data),
};

// Access Code
export const accessCodeAPI = {
    generate: (data: { type: string; expiresInHours: number; usageLimit: number }) =>
        api.post('/access-code/generate', data),
    validate: (code: string) => api.post('/access-code/validate', { code }),
    getMyCodes: () => api.get('/access-code/my'),
};

// Visitor
export const visitorAPI = {
    entry: (data: { visitorName: string; code: string }) => api.post('/visitor/entry', data),
    exit: (logId: string) => api.post('/visitor/exit', { logId }),
    getLogs: (page = 1) => api.get(`/visitor/logs?page=${page}`),
    getActive: () => api.get('/visitor/active'),
};

// Amenities
export const amenityAPI = {
    create: (data: any) => api.post('/amenities', data),
    getAll: () => api.get('/amenities'),
    update: (id: string, data: any) => api.put(`/amenities/${id}`, data),
    delete: (id: string) => api.delete(`/amenities/${id}`),
};

// Bookings
export const bookingAPI = {
    create: (data: { amenityId: string; slotTime: string; date: string }) =>
        api.post('/bookings', data),
    getMyBookings: () => api.get('/bookings/my'),
    cancel: (id: string) => api.delete(`/bookings/${id}`),
    getCommunityBookings: () => api.get('/bookings/community'),
    getAvailability: (amenityId: string, date: string) =>
        api.get(`/bookings/availability?amenityId=${amenityId}&date=${date}`),
};

// Community Board Posts
export const postAPI = {
    getAll: (page = 1, limit = 20) => api.get(`/posts?page=${page}&limit=${limit}`),
    create: (data: { content: string; category?: string; hasImage?: boolean }) =>
        api.post('/posts', data),
    update: (id: string, data: { content: string; category?: string }) =>
        api.put(`/posts/${id}`, data),
    delete: (id: string) => api.delete(`/posts/${id}`),
};

export default api;
