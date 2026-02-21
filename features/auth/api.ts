import { api } from "@/lib/api/axios";
import { 
  LoginPayload, RegisterPayload, 
  AuthResponse, PasswordResetPayload 
} from "./types";

import { User } from '../../types';

// 📍 Session Management
export const getCurrentUser = () =>
   api.get<User>("/api/auth/user/");

export const loginRequest = (data: LoginPayload) =>
   api.post<AuthResponse>("/api/auth/login/", data);

export const logoutRequest = () =>
   api.post("/api/auth/logout/");

export const refreshTokenRequest = () => 
  api.post("/api/auth/token/refresh/");

export const googleLoginRequest = (accessToken: string) =>
   api.post("/api/auth/google/", { access_token: accessToken });

// 📍 Account & Security
export const registerRequest = (data: RegisterPayload) => 
  api.post("/api/auth/registration/", data);

export const completeSignupRequest = (data: any) =>
   api.post("/api/auth/completesignup/", data);

export const resetPasswordRequest = (email: string) => 
  api.post("/api/auth/password/reset/", { email });

export const verifyResetRequest = (data: any) => 
  api.post("/api/auth/password/reset/verify/", data);

export const changePasswordRequest = (data: any) => 
  api.post("/api/auth/changepassword/", data);

export const verifyOtpRequest = (otp: string) => 
  api.post("/api/auth/verifyotp/", { otp });