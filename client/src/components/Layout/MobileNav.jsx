import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Camera, User, BarChart } from 'lucide-react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const MobileNav = () => {
    const location = useLocation();

    const navItems = [
        { path: '/', icon: Home, label: 'Home' },
        { path: '/scan', icon: Camera, label: 'Scan', isPrimary: true },
        { path: '/profile', icon: User, label: 'Profile' },
    ];

    // Don't show on auth pages or onboarding
    if (['/welcome', '/login', '/signup', '/onboarding'].includes(location.pathname)) {
        return null;
    }

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
            <div className="mx-auto flex h-16 max-w-md items-center justify-around rounded-2xl border border-gray-200 bg-white/90 px-2 backdrop-blur-xl shadow-2xl">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                twMerge(
                                    clsx(
                                        'relative flex flex-col items-center justify-center p-2 transition-colors',
                                        isActive ? 'text-primary' : 'text-gray-400 hover:text-gray-600',
                                        item.isPrimary && 'text-white'
                                    )
                                )
                            }
                        >
                            {item.isPrimary ? (
                                <div className="absolute -top-8 flex h-16 w-16 items-center justify-center rounded-full bg-primary shadow-lg shadow-primary/40 ring-4 ring-background">
                                    <item.icon className="h-8 w-8 text-white" />
                                </div>
                            ) : (
                                <>
                                    <item.icon className={clsx('h-6 w-6', isActive && 'fill-current')} />
                                    <span className="mt-1 text-xs font-medium">{item.label}</span>
                                    {isActive && (
                                        <motion.div
                                            layoutId="nav-pill"
                                            className="absolute -bottom-1 h-1 w-8 rounded-full bg-primary"
                                        />
                                    )}
                                </>
                            )}
                        </NavLink>
                    );
                })}
            </div>
        </div>
    );
};

export default MobileNav;
