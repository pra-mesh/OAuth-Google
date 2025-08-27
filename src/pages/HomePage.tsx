import React from 'react';
import { Link } from 'react-router-dom';
import { CheckSquare, Users, Shield, Zap } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Home page component
 */
export function HomePage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <div className="flex justify-center mb-8">
            <CheckSquare className="w-16 h-16 text-primary-600" />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Stay Organized with
            <span className="text-primary-600 block">TodoApp</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            A simple, secure, and powerful todo application built with React and ASP.NET Core.
            Manage your tasks efficiently with our intuitive interface.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <Link to="/todos" className="btn-primary text-lg px-8 py-3">
                Go to My Todos
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn-primary text-lg px-8 py-3">
                  Get Started Free
                </Link>
                <Link to="/login" className="btn-secondary text-lg px-8 py-3">
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Everything you need to stay productive
          </h2>
          <p className="text-lg text-gray-600">
            Built with modern technologies and best practices
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <CheckSquare className="w-12 h-12 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Task Management
            </h3>
            <p className="text-gray-600">
              Create, edit, and organize your todos with an intuitive interface
            </p>
          </div>

          <div className="text-center">
            <div className="flex justify-center mb-4">
              <Shield className="w-12 h-12 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Secure Authentication
            </h3>
            <p className="text-gray-600">
              JWT-based authentication with refresh tokens for maximum security
            </p>
          </div>

          <div className="text-center">
            <div className="flex justify-center mb-4">
              <Zap className="w-12 h-12 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Fast & Responsive
            </h3>
            <p className="text-gray-600">
              Built with React and modern web technologies for optimal performance
            </p>
          </div>

          <div className="text-center">
            <div className="flex justify-center mb-4">
              <Users className="w-12 h-12 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              User-Friendly
            </h3>
            <p className="text-gray-600">
              Clean, intuitive design that makes task management effortless
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      {!isAuthenticated && (
        <div className="bg-primary-600 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to get organized?
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              Join thousands of users who trust TodoApp for their task management
            </p>
            <Link to="/register" className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-md text-lg transition-colors">
              Start Free Today
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}