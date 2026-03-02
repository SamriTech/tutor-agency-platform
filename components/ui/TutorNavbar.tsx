import React from 'react';
import { Link } from 'react-router-dom';
import ProfileDropdown from './ProfileDropdown';

const TutorNavbar: React.FC = () => {

    return (
        <header className="bg-white sticky top-0 z-50 border-b border-neutral-200">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-[72px]">

                    {/* Left side: Logo & Navigation */}
                    <div className="flex items-center gap-8">
                        <Link to="/" className="text-3xl font-extrabold text-neutral-900 tracking-tight">
                            hytor<span className="text-primary text-4xl leading-none">.</span>
                        </Link>

                        <nav className="hidden md:flex items-center space-x-6 font-semibold text-[15px]">
                            <Link to="/tutor/dashboard" className="text-neutral-600 hover:text-primary transition-colors">Dashboard</Link>
                            <Link to="/tutor/sessions" className="text-neutral-600 hover:text-primary transition-colors">My Sessions</Link>
                            <Link to="/tutor/payment-settings" className="text-neutral-600 hover:text-primary transition-colors">Earnings</Link>
                        </nav>
                    </div>

                    {/* Right side: Actions */}
                    <div className="flex items-center space-x-4">
                        <Link to="/tutor/dashboard" className="hidden sm:block text-neutral-500 font-medium text-sm hover:text-primary transition-colors mr-2">
                            Switch to Student
                        </Link>
                        <ProfileDropdown />
                    </div>

                </div>
            </div>
        </header>
    );
};

export default TutorNavbar;
