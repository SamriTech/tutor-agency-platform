import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useVerifyReset, useChangePassword } from '../../features/auth/hooks/usePasswordReset';
import { getErrorMessage } from '../../lib/utils/errorUtils';

interface LocationState {
  phone?: string;
}

const ResetPasswordPage: React.FC = () => {
  const location = useLocation();
  const state = location.state as LocationState;
  const navigate = useNavigate();

  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');

  const verifyMutation = useVerifyReset();
  const changeMutation = useChangePassword();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!code || !password || !confirm) {
      setError('All fields are required');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }

    try {
      const verifyRes = await verifyMutation.mutateAsync({ code });
      const token = verifyRes.data.token;
      await changeMutation.mutateAsync({ token, password, confirm_password: confirm });
      alert('Password changed successfully. Please log in.');
      navigate('/login');
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
          Enter code & new password
        </h2>
        {state.phone && (
          <p className="mt-2 text-center text-sm text-neutral-600">
            Code sent to {state.phone}
          </p>
        )}
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-neutral-700">
                Verification code
              </label>
              <div className="mt-1">
                <input
                  id="code"
                  name="code"
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-700">
                New password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirm" className="block text-sm font-medium text-neutral-700">
                Confirm password
              </label>
              <div className="mt-1">
                <input
                  id="confirm"
                  name="confirm"
                  type="password"
                  required
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
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
                Update password
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

export default ResetPasswordPage;
