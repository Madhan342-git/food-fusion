import api from '../../utils/api';

const sendOtp = async (userData) => {
  try {
    const response = await api.post('/api/auth/send-otp', userData);
    return response.data;
  } catch (error) {
    console.error('OTP error:', error.response?.data || error.message);
    throw error;
  }
};