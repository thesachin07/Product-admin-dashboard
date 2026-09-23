import axiosClient from '@/lib/api/axiosClient';

export async function loginApi({ username, password }) {
  return axiosClient.post('/auth/login', {
    username,
    password,
    expiresInMins: 60,
  });
}