'use client'

import { motion } from 'framer-motion'
import { BookOpen, Clock, Play, CheckCircle, ArrowRight } from 'lucide-react'
import Link from 'next/link'

import '@/styles/lessons-dark.css'

const lessons = [
  {
    id: 'html-basics',
    title: 'HTML Fundamentals',
    description: 'Master the building blocks of web development with comprehensive HTML lessons',
    duration: '57 min',
    difficulty: 'Beginner',
    lessons: 5,
    color: 'bg-blue-50 border-blue-200',
    icon: '📝',
    completed: false
  },
  {
    id: 'css-fundamentals',
    title: 'CSS Fundamentals',
    description: 'Learn styling, layout, and responsive design with modern CSS',
    duration: 'Coming Soon',
    difficulty: 'Beginner',
    lessons: 8,
    color: 'bg-purple-50 border-purple-200',
    icon: '🎨',
    completed: false,
    comingSoon: true
  },
  {
    id: 'javascript-intro',
    title: 'JavaScript Essentials',
    description: 'Build interactive web applications with JavaScript fundamentals',
    duration: 'Coming Soon',
    difficulty: 'Beginner',
    lessons: 12,
    color: 'bg-yellow-50 border-yellow-200',
    icon: '⚡',
    completed: false,
    comingSoon: true
  }
]

export default function LessonsPage() {
  const stats = [
    { label: 'Total Lessons', value: '5', icon: BookOpen },
    { label: 'Total Duration', value: '57 min', icon: Clock },
    { label: 'Skill Tracks', value: '1', icon: CheckCircle },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold text-slate-900 mb-4">
              Interactive Coding Lessons
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Learn web development through hands-on coding exercises with real-time feedback and professional tools
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
        >
          {stats.map((stat, _index) => {
            const IconComponent = stat.icon;
            return (
              <div key={stat.label} className="bg-white rounded-xl p-6 text-center border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200">
                <IconComponent className="w-6 h-6 text-emerald-600 mx-auto mb-3" />
                <h3 className="text-2xl font-bold text-slate-900 mb-1">{stat.value}</h3>
                <p className="text-slate-600">{stat.label}</p>
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
              <div className={`rounded-xl border-2 ${lesson.color} overflow-hidden hover:shadow-xl transition-all duration-300 group ${lesson.comingSoon ? 'opacity-75' : ''}`}>
                <div className="p-6">
                  {/* Icon and Title */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{lesson.icon}</div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 mb-1">
                          {lesson.title}
                        </h3>
                        <span className="inline-block px-2 py-1 text-xs font-medium bg-slate-100 text-slate-700 rounded-full">
                          {lesson.difficulty}
                        </span>
                      </div>
                    </div>
                    {lesson.comingSoon && (
                      <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                        Coming Soon
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-slate-600 mb-6 leading-relaxed">
                    {lesson.description}
                  </p>

                  {/* Stats */}
                  <div className="flex justify-between items-center mb-6 text-sm text-slate-500">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {lesson.duration}
                    </div>
                    <div className="flex items-center">
                      <BookOpen className="w-4 h-4 mr-1" />
                      {lesson.lessons} lessons
                    </div>
                  </div>

                  {/* Action Button */}
                  {lesson.comingSoon ? (
                    <button 
                      disabled
                      className="w-full bg-slate-200 text-slate-500 font-medium py-3 px-4 rounded-lg cursor-not-allowed flex items-center justify-center"
                    >
                      <span>Coming Soon</span>
                    </button>
                  ) : (
                    <Link href={`/lessons/${lesson.id}`}>
                      <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center group-hover:bg-emerald-500 shadow-lg shadow-emerald-600/25">
                        <Play className="w-4 h-4 mr-2" />
                        Start Learning
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Learning Path */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16"
        >
          <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              Complete Learning Path
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto mb-6">
              Start with HTML fundamentals and progress through CSS and JavaScript to build complete web applications. 
              Each lesson builds upon the previous one, ensuring a solid foundation.
            </p>
            <div className="flex justify-center items-center space-x-4 text-sm text-slate-500">
              <span className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-1 text-emerald-600" />
                HTML Fundamentals
              </span>
              <ArrowRight className="w-4 h-4" />
              <span>CSS Styling</span>
              <ArrowRight className="w-4 h-4" />
              <span>JavaScript Interactivity</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}