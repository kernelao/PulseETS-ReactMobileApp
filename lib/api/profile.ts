// lib/api/profile.ts
import api from '../api';

export const fetchProfileData = async () => {
  const { data } = await api.get('/profile');
  return data;
};

export const updateAvatar = async (avatarName: string) => {
  await api.put('/user/avatar/principal', { avatarName });
};

export const changeEmail = async (oldEmail: string, newEmail: string) => {
  await api.post('/user/change-email', { oldEmail, newEmail });
};

export const changePassword = async (oldPsw: string, newPsw: string) => {
  await api.post('/user/change-password', { oldPsw, newPsw });
};
