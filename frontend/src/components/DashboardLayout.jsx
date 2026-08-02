import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function DashboardLayout() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white p-4 flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-bold mb-8 text-blue-400">CRM Engine</h2>
          <nav className="space-y-2">
            <Link to="/dashboard" className="block px-4 py-2 rounded hover:bg-slate-800">
              Dashboard
            </Link>
            <Link to="/leads" className="block px-4 py-2 rounded hover:bg-slate-800">
              Leads
            </Link>
            <Link to="/pipeline" className="block px-4 py-2 rounded hover:bg-slate-800">
              Pipeline
            </Link>
            <Link to="/analytics" className="block px-4 py-2 rounded hover:bg-slate-800">
              Analytics
            </Link>
            <Link to="/settings" className="block px-4 py-2 rounded hover:bg-slate-800">
              Settings
            </Link>
          </nav>
        </div>
        <div className="text-xs text-gray-500">v1.0.0</div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white border-b px-6 py-4 flex justify-between items-center">
          <span className="font-semibold text-gray-700">Lead Management System</span>
          <button
            type="button"
            onClick={handleLogout}
            className="text-sm text-red-600 hover:underline"
          >
            Logout
          </button>
        </header>
        <Outlet />
      </main>
    </div>
  );
}