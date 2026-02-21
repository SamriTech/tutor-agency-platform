import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Role } from '../../types';
import { useRegister } from "../../features/auth/hooks";
import { useSignupStore } from "../../store/signupStore";
import { getErrorMessage } from '../../lib/utils/errorUtils';

const RegisterPage: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const registerMutation = useRegister();
  const { registrationData: { role }, setRegistrationData, setRole } = useSignupStore();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirm_password') as string;

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const data = {
      role,
      name: formData.get('name') as string,
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
  console.log(error)
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="text-center text-4xl font-extrabold text-primary block">Hytor</Link>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-neutral-900">Create a new account</h2>
        <p className="mt-2 text-center text-sm text-neutral-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-primary hover:text-primary-light">
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
          <form className="space-y-4" onSubmit={handleRegister}>
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-neutral-700">I am a...</label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <button type="button" onClick={() => setRole(Role.Student)} className={`flex-1 px-4 py-2 text-sm rounded-l-md border font-semibold ${role === Role.Student ? 'bg-primary text-white border-primary z-10' : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50'}`}>
                  Student
                </button>
                <button type="button" onClick={() => setRole(Role.Tutor)} className={`-ml-px flex-1 px-4 py-2 text-sm rounded-r-md border font-semibold ${role === Role.Tutor ? 'bg-primary text-white border-primary z-10' : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50'}`}>
                  Tutor
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-neutral-700">Full Name</label>
                <input id="name" name="name" type="text" required className="mt-1 appearance-none block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
              </div>
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-neutral-700">Username</label>
                <input id="username" name="username" type="text" required className="mt-1 appearance-none block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700">Email address</label>
              <input id="email" name="email" type="email" autoComplete="email" required className="mt-1 appearance-none block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
            </div>

            <div>
              <label htmlFor="phone_number" className="block text-sm font-medium text-neutral-700">Phone Number</label>
              <input id="phone_number" name="phone_number" type="tel" placeholder="+251..." required className="mt-1 appearance-none block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-neutral-700">Location</label>
              <input id="location" name="location" type="text" placeholder="City, Addis Ababa" required className="mt-1 appearance-none block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="password" name="password" className="block text-sm font-medium text-neutral-700">Password</label>
                <input id="password" name="password" type="password" required className="mt-1 appearance-none block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
              </div>
              <div>
                <label htmlFor="confirm_password" name="confirm_password" className="block text-sm font-medium text-neutral-700">Confirm</label>
                <input id="confirm_password" name="confirm_password" type="password" required className="mt-1 appearance-none block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={registerMutation.isPending}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
              >
                {registerMutation.isPending ? 'Creating Account...' : 'Continue'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-neutral-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                className="w-full inline-flex justify-center py-2 px-4 border border-neutral-300 rounded-md shadow-sm bg-white text-sm font-medium text-neutral-500 hover:bg-neutral-50"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M22.56,12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26,1.37-1.04,2.53-2.21,3.31v2.77h3.57c2.08-1.92,3.28-4.74,3.28-8.09Z" fill="#4285F4" /><path d="M12,23c2.97,0,5.46-.98,7.28-2.66l-3.57-2.77c-.98.66-2.23,1.06-3.71,1.06-2.84,0-5.25-1.92-6.1-4.49H2.26v2.77C4.09,20.53,7.74,23,12,23Z" fill="#34A853" /><path d="M5.9,14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.14H2.26C1.46,8.71,1,10.3,1,12s.46,3.29,1.26,4.86Z" fill="#FBBC05" /><path d="M12,5.38c1.62,0,3.06.56,4.21,1.64l3.15-3.15C17.46,1.99,14.97,1,12,1,7.74,1,4.09,3.47,2.26,6.86L5.9,9.64c.85-2.57,3.26-4.26,6.1-4.26Z" fill="#EA4335" />
                </svg>
                Sign up with Google
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
