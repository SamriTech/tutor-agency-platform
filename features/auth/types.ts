import { User, Role } from "@/types";

export interface LoginPayload {
  username: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  username: string;
  email: string;
  phone_number: string;
  location: string;
  password1: string;
  confirm_password?: string;
  role: Role;
}

export interface VerifyOtpPayload {
  otp: string;
}

export interface CompleteSignupPayload {
  bio?: string;
  hourly_rate?: string;
  subject?: number[];
  expertise?: number[];
  grade_level?: string;
}

export interface AuthResponse {
  user: User;
  // dj-rest-auth sometimes wraps the response or adds message strings
  detail?: string;
}

// For the password reset flow in your API docs
export interface PasswordResetPayload {
  email: string;
}

export interface ChangePasswordPayload {
  old_password?: string;
  new_password1: string;
  new_password2: string;
}