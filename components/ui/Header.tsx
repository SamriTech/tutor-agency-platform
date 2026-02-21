import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import ProfileDropdown from './ProfileDropdown';

const Header: React.FC = () => {

  const user = useAuthStore(state => state.user);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex items-center justify-between h-16">

          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-primary">
              Hytor
            </Link>
          </div>

          <div className="hidden md:flex md:items-center md:space-x-8">
            <a href="/#features" className="text-neutral-600 hover:text-primary transition-colors">Features</a>
            <a href="/#pricing" className="text-neutral-600 hover:text-primary transition-colors">Pricing</a>
            <a href="/#about" className="text-neutral-600 hover:text-primary transition-colors">About Us</a>
          </div>

          <div className="hidden md:flex items-center space-x-4">

            {user ? (
              <ProfileDropdown />
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-neutral-600 hover:text-primary transition-colors">
                  Log in
                </Link>

                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark transition-colors"
                >
                  Sign up
                </Link>
              </>
            )}

          </div>

          <div className="md:hidden flex items-center">

            {user ? (

              <ProfileDropdown />

            ) : (

              <button
                type="button"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-neutral-600 hover:text-primary focus:outline-none"
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                title={isMenuOpen ? "Close menu" : "Open menu"}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}
                  />
                </svg>
              </button>

            )}

          </div>

        </div>

      </div>

      {isMenuOpen && !user && (

        <div className="md:hidden bg-white py-4">

          <div className="container mx-auto px-4 space-y-4">

            <a href="/#features" className="block text-neutral-600 hover:text-primary transition-colors">Features</a>
            <a href="/#pricing" className="block text-neutral-600 hover:text-primary transition-colors">Pricing</a>
            <a href="/#about" className="block text-neutral-600 hover:text-primary transition-colors">About Us</a>

            <div className="border-t pt-4 space-y-2">

              <Link to="/login" className="block text-sm font-medium text-neutral-600 hover:text-primary transition-colors">
                Log in
              </Link>

              <Link
                to="/register"
                className="block w-full text-center px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark transition-colors"
              >
                Sign up
              </Link>

            </div>

          </div>

        </div>

      )}

    </header>
  );
};

export default Header;