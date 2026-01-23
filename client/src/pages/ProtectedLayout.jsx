import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MobileNav from '../components/Layout/MobileNav';

export default function ProtectedLayout() {
    const { user, loading } = useAuth();

    if (loading) return <div className="min-h-screen flex items-center justify-center text-primary">Loading...</div>;

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="min-h-screen pb-24">
            <Outlet />
            <MobileNav />
        </div>
    );
}
