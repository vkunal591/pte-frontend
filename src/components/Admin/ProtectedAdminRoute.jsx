import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedAdminRoute = () => {
    const { user, token } = useSelector((state) => state.auth);

    // console.log("ProtectedAdminRoute Debug:", { user, role: user?.role });

    // Only check for user, as token is handled via httpOnly cookies
    if (!user) {
        // console.log("Redirecting to /signin: Missing user");
        return <Navigate to="/signin" replace />;
    }

    if (user.role !== 'admin') {
        // console.log("Redirecting to /dashboard: User is not admin");
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
};

export default ProtectedAdminRoute;
