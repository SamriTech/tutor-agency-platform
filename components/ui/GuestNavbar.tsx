import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const GuestNavbar: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="bg-white sticky top-0 z-50 border-b border-neutral-200">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-[72px]"> {/* Slightly taller Fiverr style */}

                    {/* Left side: Logo & Navigation */}
                    <div className="flex items-center gap-8">
                        <Link to="/" className="text-3xl font-extrabold text-neutral-900 tracking-tight">
                            hytor<span className="text-primary text-4xl leading-none">.</span>
                        </Link>

                        <nav className="hidden md:flex items-center space-x-6 font-semibold text-[15px]">
                            <a href="/#features" className="text-neutral-600 hover:text-primary transition-colors">Features</a>
                            <a href="/#pricing" className="text-neutral-600 hover:text-primary transition-colors">Pricing</a>
                            <a href="/#about" className="text-neutral-600 hover:text-primary transition-colors">About Us</a>
                        </nav>
                    </div>

                    {/* Right side: Actions */}
                    <div className="hidden md:flex items-center space-x-6">
                        <Link to="/login" className="text-[15px] font-semibold text-neutral-600 hover:text-primary transition-colors">
                            Sign in
                        </Link>

                        <Link
                            to="/register"
                            className="px-5 py-2 text-[15px] font-bold text-primary border border-primary rounded hover:bg-primary hover:text-white transition-all duration-300"
                        >
                            Join
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            type="button"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-neutral-600 hover:text-primary focus:outline-none"
                            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                        >
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} />
                            </svg>
                        </button>
                    </div>

                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-white py-4 border-t border-neutral-100">
                    <div className="container mx-auto px-4 space-y-4 font-semibold text-[15px]">
                        <a href="/#features" className="block text-neutral-600 hover:text-primary">Features</a>
                        <a href="/#pricing" className="block text-neutral-600 hover:text-primary">Pricing</a>
                        <a href="/#about" className="block text-neutral-600 hover:text-primary">About Us</a>

                        <div className="border-t pt-4 space-y-3">
                            <Link to="/login" className="block w-full text-center text-neutral-600 hover:text-primary">
                                Sign in
                            </Link>

                            <Link
                                to="/register"
                                className="block w-full text-center px-4 py-2 text-white bg-primary rounded hover:bg-primary-dark transition-colors"
                            >
                                Join
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default GuestNavbar;
