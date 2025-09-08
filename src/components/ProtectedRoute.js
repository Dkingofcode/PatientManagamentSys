import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
//import type { UserRole } from '../contexts/AuthContext';
// interface ProtectedRouteProps {
//   children: React.ReactNode;
//   allowedRoles: UserRole[];
// }
// function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
//   const { user, isAuthenticated } = useAuth();
//   if (!isAuthenticated) {
//     return <Navigate to="/login" replace />;
//   }
//   if (user && !allowedRoles.includes(user.role)) {
//     // Redirect to their appropriate dashboard
//     const roleRoutes = {
//       'front-desk': '/front-desk',
//       'doctor': '/doctor',
//       'lab-technician': '/lab-technician',
//       'admin': '/admin',
//       'patient': '/patient',
//     };
//     return <Navigate to={roleRoutes[user.role]} replace />;
//   }
//   return <>{children}</>;
// }
// export default ProtectedRoute;
export default function ProtectedRoute({ element, allowedRoles }) {
    const { user, isAuthenticated } = useAuth();
    if (!isAuthenticated) {
        return <Navigate to="/login"/>;
    }
    // 👇 Admins can access everything
    if (user?.role !== 'admin' && !allowedRoles.includes(user?.role ?? '')) {
        return <Navigate to="/login"/>;
    }
    return element;
}
// // src/components/PrivateRoute.tsx
// import { useSelector } from 'react-redux';
// import { Navigate, Outlet } from 'react-router-dom';
// import type { RootState } from '../store/store';
// const PrivateRoute = () => {
//   const { isAuthenticated } = useSelector((state: RootState) => state.auth);
//   return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
// };
// export default PrivateRoute;
