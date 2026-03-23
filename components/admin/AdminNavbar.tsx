import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import ProfileDropdown from '../ui/ProfileDropdown';
import { LayoutDashboard, Users, GraduationCap } from 'lucide-react';

const AdminNavbar: React.FC = () => {
    const location = useLocation();

    const navItems = [
        { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Users', path: '/admin/users', icon: Users },
        { name: 'Qualifications', path: '/admin/qualifications', icon: GraduationCap },
    ];

    return (
        <header className="bg-white sticky top-0 z-50 border-b border-neutral-200">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-[72px]">

                    {/* Left side: Logo & Navigation */}
                    <div className="flex items-center gap-12">
                        <Link to="/" className="text-3xl font-extrabold text-neutral-900 tracking-tight">
                            hytor<span className="text-primary text-4xl leading-none">.</span>
                            <span className="ml-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary/40">Admin</span>
                        </Link>

                        <nav className="hidden md:flex items-center space-x-8 font-bold text-xs uppercase tracking-widest">
                            {navItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex items-center gap-2 transition-colors ${location.pathname === item.path
                                            ? 'text-primary'
                                            : 'text-neutral-500 hover:text-neutral-900'
                                        }`}
                                >
                                    <item.icon className="w-4 h-4" />
                                    {item.name}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* Right side: Actions */}
                    <div className="flex items-center space-x-4">
                        <ProfileDropdown />
                    </div>

                </div>
            </div>
        </header>
    );
};

export default AdminNavbar;
