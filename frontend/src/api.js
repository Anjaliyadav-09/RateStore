
const API_BASE_URL = "http://localhost:5000/api";

export const API_ENDPOINTS = {
  signup: `${API_BASE_URL}/auth/signup`,
  login: `${API_BASE_URL}/auth/login`,
  forgotPassword: `${API_BASE_URL}/auth/forgot-password`,
  resetPassword: `${API_BASE_URL}/auth/reset-password`,
  profile: `${API_BASE_URL}/users/profile`,
  updatePassword: `${API_BASE_URL}/users/update-password`,
  stores: `${API_BASE_URL}/stores`,
  ratings: `${API_BASE_URL}/ratings`,
  adminDashboard: `${API_BASE_URL}/admin/dashboard`,
  adminUsers: `${API_BASE_URL}/admin/users`,
  adminStores: `${API_BASE_URL}/admin/stores`,
  ownerDashboard: `${API_BASE_URL}/owner/dashboard`,
};

export default API_BASE_URL;
