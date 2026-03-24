import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Role } from '../../types';
import { useRegister, useGoogleLogin } from "../../features/auth/hooks";
import { useSignupStore } from "../../store/signupStore";
import { getErrorMessage } from '../../lib/utils/errorUtils';
import { Loader2 } from 'lucide-react';
import { useGoogleLogin as useGoogleOAuth } from '@react-oauth/google';

const RegisterPage: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const registerMutation = useRegister();
  const googleMutation = useGoogleLogin();
  const { registrationData: { role }, setRegistrationData, setRole } = useSignupStore();

  const handleGoogleLogin = useGoogleOAuth({
    onSuccess: async (tokenResponse) => {
      setError(null);
      try {
        const result = await googleMutation.mutateAsync(tokenResponse.access_token);
        const user = result.data.user;

        const isProfileComplete = user.phone_number && (
          (user.role === Role.Tutor && user.tutor_profile?.bio) ||
          (user.role === Role.Student && user.student_profile?.grade_level)
        );

        if (!isProfileComplete) {
          navigate('/finish-signup');
          return;
        }

        if (user.role === Role.Tutor) {
          navigate('/tutor/dashboard');
        } else {
          navigate('/parent/dashboard');
        }
      } catch (err: any) {
        setError(getErrorMessage(err) || "Google login failed");
      }
    },
    onError: () => setError("Google login failed")
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const password = formData.get('password1') as string;
    const confirmPassword = formData.get('confirm_password') as string;

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const data = {
      role,
      first_name: formData.get('first_name') as string,
      last_name: formData.get('last_name') as string,
      username: formData.get('username') as string,
      email: formData.get('email') as string,
      phone_number: formData.get('phone_number') as string,
      location: formData.get('location') as string,
      password1: password,
    };

    try {
      await registerMutation.mutateAsync(data);
      setRegistrationData(data);
      navigate('/finish-signup');
    } catch (err: any) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="text-center text-4xl font-extrabold text-primary block">Hytor</Link>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-neutral-900 tracking-tight">Create a new account</h2>
        <p className="mt-2 text-center text-sm text-neutral-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-primary hover:text-primary-dark transition-colors">
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-10 px-8 shadow-xl rounded-2xl sm:px-10 border border-neutral-100">
          <form className="space-y-4" onSubmit={handleRegister}>
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-xl">
                <p className="text-sm text-red-700 font-medium">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">I am a...</label>
              <div className="flex p-1 bg-neutral-50 rounded-xl border border-neutral-100">
                <button
                  type="button"
                  onClick={() => setRole(Role.Student)}
                  className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${role === Role.Student ? 'bg-white text-primary shadow-sm' : 'text-neutral-500 hover:text-neutral-700'}`}
                >
                  Student
                </button>
                <button
                  type="button"
                  onClick={() => setRole(Role.Tutor)}
                  className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${role === Role.Tutor ? 'bg-white text-primary shadow-sm' : 'text-neutral-500 hover:text-neutral-700'}`}
                >
                  Tutor
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="first_name" className="block text-sm font-semibold text-neutral-700 mb-2">First Name</label>
                <input id="first_name" name="first_name" type="text" required className="w-full px-4 py-2 bg-neutral-50 border-2 border-neutral-50 rounded-xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none" />
              </div>
              <div>
                <label htmlFor="last_name" className="block text-sm font-semibold text-neutral-700 mb-2">Last Name</label>
                <input id="last_name" name="last_name" type="text" required className="w-full px-4 py-2 bg-neutral-50 border-2 border-neutral-50 rounded-xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none" />
              </div>
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-semibold text-neutral-700 mb-2">Username</label>
              <input id="username" name="username" type="text" required className="w-full px-4 py-2 bg-neutral-50 border-2 border-neutral-50 rounded-xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none" />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-neutral-700 mb-2">Email address</label>
              <input id="email" name="email" type="email" autoComplete="email" required className="w-full px-4 py-2 bg-neutral-50 border-2 border-neutral-50 rounded-xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none" />
            </div>

            <div>
              <label htmlFor="phone_number" className="block text-sm font-semibold text-neutral-700 mb-2">Phone Number</label>
              <input id="phone_number" name="phone_number" type="tel" placeholder="+251..." required className="w-full px-4 py-2 bg-neutral-50 border-2 border-neutral-50 rounded-xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none" />
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-semibold text-neutral-700 mb-2">Location</label>
              <input id="location" name="location" type="text" placeholder="City, Addis Ababa" required className="w-full px-4 py-2 bg-neutral-50 border-2 border-neutral-50 rounded-xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="password1" className="block text-sm font-semibold text-neutral-700 mb-2">Password</label>
                <input id="password1" name="password1" type="password" required className="w-full px-4 py-2 bg-neutral-50 border-2 border-neutral-50 rounded-xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none" />
              </div>
              <div>
                <label htmlFor="confirm_password" className="block text-sm font-semibold text-neutral-700 mb-2">Confirm</label>
                <input id="confirm_password" name="confirm_password" type="password" required className="w-full px-4 py-2 bg-neutral-50 border-2 border-neutral-50 rounded-xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none" />
              </div>
            </div>

            <button
              type="submit"
              disabled={registerMutation.isPending}
              className="w-full py-4 px-6 bg-primary text-white font-bold rounded-xl shadow-lg hover:bg-primary-dark transition-all transform hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:transform-none flex items-center justify-center gap-2"
            >
              {registerMutation.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating Account...
                </>
              ) : (
                'Continue'
              )}
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-neutral-500 font-medium">Or continue with</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleGoogleLogin()}
              disabled={googleMutation.isPending}
              className="w-full flex items-center justify-center py-2.5 px-4 border-2 border-neutral-100 rounded-xl text-sm font-bold text-neutral-700 bg-white hover:bg-neutral-50 transition-all gap-3 shadow-sm hover:border-neutral-200 disabled:opacity-50 transform hover:-translate-y-1 active:scale-95"
            >
              {googleMutation.isPending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
              )}
              <span>Sign up with Google</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
