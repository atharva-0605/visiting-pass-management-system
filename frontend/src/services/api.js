import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const storedUser = localStorage.getItem('user');
    let user = null;
    try {
      user = storedUser ? JSON.parse(storedUser) : null;
    } catch {
      user = null;
    }

    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


export const signup = (data) => api.post('/auth/signup', data);
export const login = (data) => api.post('/auth/login', data);

export const getVisitors = () => api.get('/visitors');
export const getVisitor = (id) => api.get(`/visitors/${id}`);
export const createVisitor = (formData) =>api.post('/visitors', formData, {headers: { 'Content-Type': 'multipart/form-data' },});
export const updateVisitor = (id, formData) =>api.put(`/visitors/${id}`, formData, {headers: { 'Content-Type': 'multipart/form-data' },});
export const deleteVisitor = (id) => api.delete(`/visitors/${id}`);

export const getAppointments = (params) => api.get('/appointments', { params });
export const getAppointment = (id) => api.get(`/appointments/${id}`);
export const createAppointment = (data) => api.post('/appointments', data);
export const updateAppointment = (id, data) => api.put(`/appointments/${id}`, data);
export const updateAppointmentStatus = (id, status) =>api.put(`/appointments/${id}/status`, { status });
export const deleteAppointment = (id) => api.delete(`/appointments/${id}`);

export const getPasses = (params) => api.get('/passes', { params });
export const getPass = (id) => api.get(`/passes/${id}`);
export const createPass = (data) => api.post('/passes', data);
export const updatePass = (id, data) => api.put(`/passes/${id}`, data);
export const deletePass = (id) => api.delete(`/passes/${id}`);
export const getPassQr = (id) => api.get(`/passes/${id}/qr`);
export const fetchLiveVisitors = () => api.get('/passes/live');

export const getCheckLogs = (params) => api.get('/checklogs', { params });
export const getCheckLog = (id) => api.get(`/checklogs/${id}`);
export const scanPass = (data) => api.post('/checklogs/scan', data);
export const deleteCheckLog = (id) => api.delete(`/checklogs/${id}`, { responseType: 'blob' });

export const getSummaryReport = (params) => api.get('/reports/summary', { params });
export const getDailyVisits = (params) => api.get('/reports/daily-visits', { params });
export const getHostVisits = (params) => api.get('/reports/host-visits', { params });
export const getVisitsExport = (params) => api.get('/reports/visits-export', { params });

export default api;
