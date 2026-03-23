import React, { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import UserCircleIcon from '../icons/UserCircleIcon';
import CheckCircleIcon from '../icons/CheckCircleIcon';
import StarIcon from '../icons/StarIcon'; // Using StarIcon as placeholder for Lock
import CreditCardIcon from '../icons/CreditCardIcon';
import BriefcaseIcon from '../icons/BriefcaseIcon';

interface ProfileLayoutProps {
    children: ReactNode;
    userRole: 'parent' | 'tutor';
    pageTitle: string;
}

const ProfileLayout: React.FC<ProfileLayoutProps> = ({ children, userRole, pageTitle }) => {
    const baseRoute = userRole === 'parent' || userRole == "student" ? '/parent' : '/tutor';

    const navItems = [
        ...(userRole == "parent" || userRole == "student" ? [{
            label: 'Edit Profile',
            path: `${baseRoute}/profile${userRole === 'tutor' ? '/edit' : ''}`,
            icon: <UserCircleIcon className="w-5 h-5" />,
        }] : []),
        ...(userRole == "tutor" ? [{
            label: 'My Gig Profile',
            path: `/tutor/gig-profile`,
            icon: <BriefcaseIcon className="w-5 h-5" />,
        }] : []),
        {
            label: 'Verification Status',
            path: `${baseRoute}/verification`,
            icon: <CheckCircleIcon className="w-5 h-5" />,
        },
        {
            label: 'Wallet & History',
            path: `${baseRoute}/wallet`,
            icon: <CreditCardIcon className="w-5 h-5" />,
        },
    ];

    return (
        <div className="bg-neutral-50 min-h-screen flex flex-col">
            <Header />

            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Sidebar */}
                    <aside className="lg:w-64 flex-shrink-0">
                        <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden sticky top-24">
                            <div className="p-6 border-b border-neutral-50">
                                <h2 className="text-lg font-bold text-neutral-900">Account Settings</h2>
                            </div>
                            <nav className="p-2">
                                {navItems.map((item) => (
                                    <NavLink
                                        key={item.path}
                                        to={item.path}
                                        className={({ isActive }) =>
                                            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${isActive
                                                ? 'bg-primary/10 text-primary'
                                                : 'text-neutral-500 hover:bg-neutral-50'
                                            }`
                                        }
                                    >
                                        {item.icon}
                                        {item.label}
                                    </NavLink>
                                ))}
                            </nav>
                        </div>
                    </aside>

                    {/* Content Area */}
                    <div className="flex-grow">
                        <div className="mb-6">
                            <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">
                                {pageTitle}
                            </h1>
                        </div>
                        {children}
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
};

export default ProfileLayout;
