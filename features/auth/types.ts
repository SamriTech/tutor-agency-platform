import { User, Role } from "@/types";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: Role; // Using the Enum from your global types
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