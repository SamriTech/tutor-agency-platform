import { api } from "./axios";
import { User } from "../types";

export const getMe = async (): Promise<User> => {
  const res = await api.get<User>("/api/auth/users/me/");
  return res.data;
};

export const updateMe = async (
  data: Partial<User> | FormData
): Promise<User> => {
  // backend accepts POST to the same endpoint for partial updates as well
  const res = await api.post<User>("/api/auth/users/me/", data, {
    headers: data instanceof FormData ? { "Content-Type": "multipart/form-data" } : undefined,
  });
  return res.data;
};

export const deleteMe = async (): Promise<void> => {
  await api.delete("/api/auth/users/me/");
};

export const getUserById = async (id: string | number): Promise<User> => {
  const res = await api.get<User>(`/api/auth/users/${id}/`);
  return res.data;
};

export const getUserAvailability = async (id: number) => {
  const res = await api.get(`/api/auth/users/${id}/availabilities/`);
  return res.data;
};

export const getSubjects = async () => {
  const res = await api.get('/api/auth/subjects/');
  return res.data;
};