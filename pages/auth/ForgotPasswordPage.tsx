import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useResetPassword } from '../../features/auth/hooks/usePasswordReset';
import { getErrorMessage } from '../../lib/utils/errorUtils';

const ForgotPasswordPage: React.FC = () => {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const resetMutation = useResetPassword();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!phone) {
      setError('Please enter your phone number.');
      return;
    }

    try {
      const res = await resetMutation.mutateAsync(phone);
      if (res.data.status === 'success') {
        navigate('/reset-password', { state: { phone } });
      } else {
        setError(res.data.message || 'Unable to send reset code');
      }
    } catch (err: any) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="text-center text-4xl font-extrabold text-primary">
          Hytor
        </Link>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-neutral-900">
          Reset your password
        </h2>
        <p className="mt-2 text-center text-sm text-neutral-600">
          Enter the phone number associated with your account and we'll send an OTP
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-neutral-700">
                Phone number
              </label>
              <div className="mt-1">
                <input
                  id="phone"
                  name="phone"
                  type="text"
                  autoComplete="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                />
              </div>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Send code
              </button>
            </div>

            <div className="text-sm text-center">
              <Link to="/login" className="font-medium text-primary hover:text-primary-light">
                Back to login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
