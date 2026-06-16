import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 30);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { to: '/', label: 'Home' },
        { to: '/treatments', label: 'Treatments' },
        { to: '/about', label: 'About Us' },
        { to: '/testimonials', label: 'Testimonials' },
    ];

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-bg-cream/80 clear backdrop-blur-md shadow-sm py-5' : 'bg-transparent py-5'}`}>
            <div className="px-6 lg:px-12 flex justify-between items-center max-w-350 mx-auto">
                {/* Logo */}
                <Link to="/" className="flex items-center justify-center gap-2.5">
                    <img src="./src/assets/logo/logoicon.svg" alt="Solène logo" className="w-7 h-7" />
                    <span className="font-serif text-xl font-bold text-text-dark tracking-wide">
                        Solène
                    </span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-7 text-[13px] font-medium text-text-dark">
                    {navLinks.map((link) => (
                        <Link
                            key={link.to}
                            to={link.to}
                            className={`relative py-1 transition-colors hover:text-primary ${location.pathname === link.to ? 'text-primary' : ''}`}
                        >
                            {link.label}
                            {location.pathname === link.to && (
                                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full"></span>
                            )}
                        </Link>
                    ))}
                </nav>

                {/* CTA */}
                <div className="hidden md:block">
                    <Link to="/contact" className="px-5 py-2 bg-primary text-white font-medium text-[13px] rounded-full hover:bg-primary-hover transition-all shadow-sm hover:shadow-md">
                        Contact Us
                    </Link>
                </div>

                {/* Mobile toggle */}
                <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-text-dark">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        {mobileOpen ? (
                            <>
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </>
                        ) : (
                            <>
                                <line x1="3" y1="12" x2="21" y2="12" />
                                <line x1="3" y1="6" x2="21" y2="6" />
                                <line x1="3" y1="18" x2="21" y2="18" />
                            </>
                        )}
                    </svg>
                </button>
            </div>

            {/* Mobile menu */}
            {mobileOpen && (
                <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-100 px-6 pb-5 pt-3 space-y-3">
                    {navLinks.map((link) => (
                        <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)} className="block text-text-dark text-sm font-medium py-1.5 hover:text-primary transition-colors">
                            {link.label}
                        </Link>
                    ))}
                    <Link to="/contact" onClick={() => setMobileOpen(false)} className="block text-center px-5 py-2 bg-primary text-white text-sm font-medium rounded-full mt-2">
                        Contact Us
                    </Link>
                </div>
            )}
        </header>
    );
};

export default Navbar;