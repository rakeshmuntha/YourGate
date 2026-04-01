import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' },
});

// Auth
export const authAPI = {
    login: (data: { email: string; password: string }) => api.post('/auth/login', data),
    register: (data: any) => api.post('/auth/register', data),
    logout: () => api.post('/auth/logout'),
    getMe: () => api.get('/auth/me'),
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

export default api;
