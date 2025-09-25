'use client'

import { motion } from 'framer-motion'
import { Code, BookOpen, Trophy, Clock, Play, Star } from 'lucide-react'
import Link from 'next/link'



const lessons = [
  {
    id: 'html-basics',
    title: 'HTML Basics',
    description: 'Learn the fundamentals of HTML structure and elements',
    duration: '30 min',
    difficulty: 'Beginner',
    lessons: 8,
    color: 'from-orange-500 to-red-500',
    icon: '🏗️',
    completed: false
  },
  {
    id: 'css-fundamentals',
    title: 'CSS Fundamentals',
    description: 'Master styling and layout with CSS',
    duration: '45 min',
    difficulty: 'Beginner',
    lessons: 12,
    color: 'from-blue-500 to-purple-500',
    icon: '🎨',
    completed: false
  },
  {
    id: 'javascript-intro',
    title: 'JavaScript Introduction',
    description: 'Get started with programming logic and interactivity',
    duration: '60 min',
    difficulty: 'Beginner',
    lessons: 15,
    color: 'from-yellow-500 to-orange-500',
    icon: '⚡',
    completed: false
  }
]

export default function LessonsPage() {
  const stats = [
    { label: 'Total Lessons', value: '35+', icon: BookOpen },
    { label: 'Total Duration', value: '2-3 hrs', icon: Clock },
    { label: 'Skill Tracks', value: '3', icon: Trophy },
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="flex items-center justify-center mb-6">
              <div className="bg-blue-600 p-3 rounded-full mr-4">
                <Code className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-white">
                Interactive Coding Lessons
              </h1>
            </div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Master web development through hands-on coding exercises with real-time feedback and professional-grade tools
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          {stats.map((stat, _index) => {
            const IconComponent = stat.icon;
            return (
              <div key={stat.label} className="bg-gray-800 rounded-lg p-6 text-center border border-gray-700">
                <IconComponent className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
                <p className="text-gray-400">{stat.label}</p>
              </div>
            );
          })}
        </motion.div>

        {/* Lesson Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {lessons.map((lesson, _index) => (
            <motion.div
              key={lesson.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * _index }}
            >
              <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden hover:border-blue-500 transition-all duration-300 group">
                {/* Gradient Header */}
                <div className={`h-2 bg-gradient-to-r ${lesson.color}`} />
                
                <div className="p-6">
                  {/* Icon and Title */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="text-3xl mr-3">{lesson.icon}</div>
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1">
                          {lesson.title}
                        </h3>
                        <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-600 text-blue-100 rounded-full">
                          {lesson.difficulty}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 mr-1" />
                      <span className="text-sm text-gray-400">4.8</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-300 mb-6">
                    {lesson.description}
                  </p>

                  {/* Stats */}
                  <div className="flex justify-between items-center mb-6 text-sm text-gray-400">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {lesson.duration}
                    </div>
                    <div className="flex items-center">
                      <BookOpen className="w-4 h-4 mr-1" />
                      {lesson.lessons} lessons
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-300">Progress</span>
                      <span className="text-sm text-gray-400">0%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full w-0 transition-all duration-300" />
                    </div>
                  </div>

                  {/* Action Button */}
                  <Link href={`/lessons/${lesson.id}`}>
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center group-hover:bg-blue-500">
                      <Play className="w-4 h-4 mr-2" />
                      Start Learning
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Coming Soon */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16"
        >
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-8">
            <div className="inline-block px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-sm font-medium mb-4">
              Coming Soon
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              More Advanced Tracks
            </h2>
            <p className="text-gray-300 max-w-md mx-auto">
              React, Node.js, Python, and more advanced programming concepts are coming soon!
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}