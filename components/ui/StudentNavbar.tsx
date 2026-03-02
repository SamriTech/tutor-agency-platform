import React from 'react';
import { Link } from 'react-router-dom';
import ProfileDropdown from './ProfileDropdown';

const StudentNavbar: React.FC = () => {

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
                            <Link to="/parent/dashboard" className="text-neutral-600 hover:text-primary transition-colors">Dashboard</Link>
                            <Link to="/parent/find-tutors" className="text-neutral-600 hover:text-primary transition-colors">Find Tutors</Link>
                            <Link to="/parent/request-status" className="text-neutral-600 hover:text-primary transition-colors">My Requests</Link>
                        </nav>
                    </div>

                    {/* Right side: Actions */}
                    <div className="flex items-center space-x-4">
                        <div className="hidden sm:block text-neutral-500 font-medium text-sm hover:text-primary transition-colors cursor-pointer mr-2">
                            Messages
                        </div>
                        <ProfileDropdown />
                    </div>

                </div>
            </div>
        </header>
    );
};

export default StudentNavbar;
