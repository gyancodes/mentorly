'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, BookOpen, User, Settings, LogOut } from 'lucide-react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-semibold text-gray-900">Mentorly</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/lessons" 
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Lessons
            </Link>
            <Link 
              href="/chat" 
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              AI Mentor
            </Link>
            <Link 
              href="/docs" 
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Documentation
            </Link>
          </div>

          {/* Profile Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors"
              >
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-blue-600" />
                </div>
                <span className="font-medium">Profile</span>
              </button>

              {/* Profile Dropdown */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                  <Link
                    href="/profile"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <User className="w-4 h-4 mr-3" />
                    My Profile
                  </Link>
                  <Link
                    href="/settings"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <Settings className="w-4 h-4 mr-3" />
                    Settings
                  </Link>
                  <hr className="my-1" />
                  <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    <LogOut className="w-4 h-4 mr-3" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                href="/lessons"
                className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Lessons
              </Link>
              <Link
                href="/chat"
                className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                AI Mentor
              </Link>
              <Link
                href="/docs"
                className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Documentation
              </Link>
              <hr className="my-2" />
              <Link
                href="/profile"
                className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                My Profile
              </Link>
              <Link
                href="/settings"
                className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Settings
              </Link>
              <button className="block w-full text-left px-3 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}