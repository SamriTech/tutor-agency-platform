import React from 'react';
import { useAuthStore } from '@/store/authStore';
import { Role } from '../../types';

import GuestNavbar from './GuestNavbar';
import TutorNavbar from './TutorNavbar';
import StudentNavbar from './StudentNavbar';
// Fallback for Admin, using StudentNavbar/GuestNavbar as a base or creating a simple one.
// We'll just use StudentNavbar as a default logged-in fallback if not Tutor/Admin,
// but for Admin let's just show a basic one or GuestNavbar.
// For now, let's use StudentNavbar for Admin as well since it has a dashboard link.

const Header: React.FC = () => {
  const user = useAuthStore(state => state.user);

  if (!user) {
    return <GuestNavbar />;
  }

  if (user.role === Role.Tutor) {
    return <TutorNavbar />;
  }

  if (user.role === Role.Parent) {
    return <StudentNavbar />;
  }

  // Default fallback for logged-in users (like Admin)
  return <StudentNavbar />;
};

export default Header;