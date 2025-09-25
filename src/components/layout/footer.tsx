import { BookOpen, Github, Twitter, Linkedin, Mail } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-semibold text-gray-900">Mentorly</span>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              AI-powered learning platform designed to accelerate your programming journey with personalized mentorship and interactive lessons.
            </p>
          </div>

          {/* Learning */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Learning
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/lessons" className="text-gray-600 hover:text-blue-600 text-sm transition-colors">
                  All Lessons
                </Link>
              </li>
              <li>
                <Link href="/lessons/html-basics" className="text-gray-600 hover:text-blue-600 text-sm transition-colors">
                  HTML Basics
                </Link>
              </li>
              <li>
                <Link href="/lessons/css-fundamentals" className="text-gray-600 hover:text-blue-600 text-sm transition-colors">
                  CSS Fundamentals
                </Link>
              </li>
              <li>
                <Link href="/lessons/javascript-intro" className="text-gray-600 hover:text-blue-600 text-sm transition-colors">
                  JavaScript Intro
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Support
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/docs" className="text-gray-600 hover:text-blue-600 text-sm transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/chat" className="text-gray-600 hover:text-blue-600 text-sm transition-colors">
                  AI Mentor
                </Link>
              </li>
              <li>
                <Link href="/help" className="text-gray-600 hover:text-blue-600 text-sm transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-blue-600 text-sm transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Company
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-gray-600 hover:text-blue-600 text-sm transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-gray-600 hover:text-blue-600 text-sm transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-600 hover:text-blue-600 text-sm transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-600 hover:text-blue-600 text-sm transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-600 text-sm">
              © 2024 Mentorly. All rights reserved.
            </div>
            
            {/* Social Links */}
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a
                href="https://github.com"
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com"
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="mailto:contact@mentorly.com"
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}