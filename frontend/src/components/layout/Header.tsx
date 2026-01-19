import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const Header = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <span className="text-2xl">🍽️</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              IoT Order System
            </h1>
          </div>
          
          <button
            onClick={handleLogout}
            className="bg-white hover:bg-gray-100 text-blue-600 font-semibold px-6 py-2 rounded-lg transition duration-200"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};