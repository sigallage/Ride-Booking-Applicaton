import apiClient from './apiClient';

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
}

export interface UserCreateRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export const userService = {
  registerUser: (data: UserCreateRequest) =>
    apiClient.post<User>('/users', data).then(response => response.data),

  getUser: (id: number) =>
    apiClient.get<User>(`/users/${id}`),

  getAllUsers: () =>
    apiClient.get<User[]>('/users'),
};

export default userService;
