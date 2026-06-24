import { Navigate, useLocation } from 'react-router';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'field_officer' | 'customer';
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#E8F5F7] via-white to-[#F7FCE6] flex items-center justify-center">
        <div className="text-center">
          <div className="size-16 border-4 border-[#17A2B8] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Memeriksa autentikasi...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    const redirectPath = requiredRole === 'admin'
      ? '/admin/login'
      : requiredRole === 'customer'
        ? '/customer/login'
        : '/field-officer/login';
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    const destination = user.role === 'admin'
      ? '/admin'
      : user.role === 'customer'
        ? '/customer'
        : '/field-officer';
    return <Navigate to={destination} replace />;
  }

  return <>{children}</>;
}
