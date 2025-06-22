
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('ProtectedRoute - Loading:', loading, 'User:', user?.email || 'No user');
    
    if (!loading && !user) {
      console.log('No user found and not loading, redirecting to auth');
      navigate('/auth', { replace: true });
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FF5733] to-[#FF7F50] flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse backdrop-blur-sm">
            <span className="text-2xl font-bold text-white">Z</span>
          </div>
          <h3 className="text-lg font-semibold mb-2">Loading ZapDine...</h3>
          <p className="text-white/80">Setting up your restaurant dashboard</p>
          <div className="mt-4">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
