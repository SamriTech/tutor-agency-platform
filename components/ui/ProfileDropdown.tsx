import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Role } from '../../types';

import ChevronDownIcon from '../icons/ChevronDownIcon';
import UserCircleIcon from '../icons/UserCircleIcon';
import CogIcon from '../icons/CogIcon';
import LogoutIcon from '../icons/LogoutIcon';
import { useLogout } from "../../features/auth/hooks"
const ProfileDropdown: React.FC = () => {

    const user = useAuthStore(state => state.user);
    const { mutateAsync, isError } = useLogout()
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleLogout = () => {
        mutateAsync()
        navigate('/');
    };

    const getDashboardPath = () => {

        if (!user) return '/login';

        switch (user.role) {
            case Role.Parent:
                return '/parent/dashboard';

            case Role.Tutor:
                return '/tutor/dashboard';

            case Role.Admin:
                return '/admin/dashboard';

            default:
                return '/login';
        }
    };

    const getProfilePath = () => {

        if (!user) return '/login';

        switch (user.role) {

            case Role.Parent:
                return '/parent/profile';

            case Role.Tutor:
                return '/tutor/profile/edit';

            default:
                return getDashboardPath();
        }
    };

    useEffect(() => {

        const handleClickOutside = (event: MouseEvent) => {

            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => document.removeEventListener('mousedown', handleClickOutside);

    }, []);

    if (!user) return null;

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 p-1 rounded-full hover:bg-neutral-100 transition-colors"
            >
                <img
                    src={user.photo || `https://ui-avatars.com/api/?name=${user.username.replace(' ', '+')}&background=4C1D95&color=fff`}
                    alt={user.username}
                    className="w-8 h-8 rounded-full"
                />

                <span className="hidden sm:inline text-sm font-medium text-neutral-700">
                    {user.username}
                </span>

                <ChevronDownIcon className="hidden sm:inline w-5 h-5 text-neutral-500" />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 ring-1 ring-black ring-opacity-5">

                    <Link
                        to={getDashboardPath()}
                        className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                        onClick={() => setIsOpen(false)}
                    >
                        Dashboard
                    </Link>

                    <Link
                        to={getProfilePath()}
                        className="flex items-center px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                        onClick={() => setIsOpen(false)}
                    >
                        <UserCircleIcon className="w-5 h-5 mr-2" /> Profile
                    </Link>

                    {user.role === Role.Tutor && (
                        <Link
                            to="/tutor/payment-settings"
                            className="flex items-center px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                            onClick={() => setIsOpen(false)}
                        >
                            <CogIcon className="w-5 h-5 mr-2" /> Payments
                        </Link>
                    )}

                    <div className="border-t my-1"></div>

                    <button
                        onClick={handleLogout}
                        className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                        <LogoutIcon className="w-5 h-5 mr-2" /> Logout
                    </button>

                </div>
            )}
        </div>
    );
};

export default ProfileDropdown;