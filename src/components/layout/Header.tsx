import React from 'react';
import { Link } from 'react-router-dom';
import { LogOut, User, CheckSquare } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Application header with navigation and user menu
 */
export function Header() {
  const { user, logout, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Navigation */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <CheckSquare className="w-8 h-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900">TodoApp</span>
            </Link>
            
            <nav className="hidden md:flex space-x-6">
              <Link
                to="/todos"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                My Todos
              </Link>
            </nav>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <User className="w-5 h-5 text-gray-400" />
              <span className="text-sm text-gray-700">
                {user?.displayName || user?.email}
              </span>
            </div>
            
            <button
              onClick={logout}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}