'use client'

import { motion } from 'framer-motion'
import { BookOpen, Clock, Target } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

import { Card } from '@/components/ui/card'
import type { Lesson } from '@/lib/lessons-data'

interface LessonContentProps {
  lesson: Lesson
}

export default function LessonContent({ lesson }: LessonContentProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="p-6 mb-6 bg-white dark:bg-slate-800 border-0 shadow-lg">
        {/* Lesson Header */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <BookOpen className="w-5 h-5" />
              <span className="text-sm font-medium uppercase tracking-wide">
                Lesson
              </span>
            </div>
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
              <Clock className="w-4 h-4" />
              <span className="text-sm">{lesson.estimatedTime} min</span>
            </div>
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
              <Target className="w-4 h-4" />
              <span className="text-sm capitalize">{lesson.difficulty}</span>
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">
            {lesson.title}
          </h1>
          
          <p className="text-lg text-slate-600 dark:text-slate-300">
            {lesson.description}
          </p>
        </div>

        {/* Lesson Content */}
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <ReactMarkdown
            components={{
              h1: ({ children }) => (
                <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-4 mt-6">
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-3 mt-5">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2 mt-4">
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p className="text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
                  {children}
                </p>
              ),
              ul: ({ children }) => (
                <ul className="list-disc list-inside text-slate-600 dark:text-slate-300 mb-4 space-y-1">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal list-inside text-slate-600 dark:text-slate-300 mb-4 space-y-1">
                  {children}
                </ol>
              ),
              li: ({ children }) => (
                <li className="text-slate-600 dark:text-slate-300">
                  {children}
                </li>
              ),
              code: ({ children, className }) => {
                const isInline = !className
                if (isInline) {
                  return (
                    <code className="bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 px-1.5 py-0.5 rounded text-sm font-mono">
                      {children}
                    </code>
                  )
                }
                return (
                  <code className="block bg-slate-900 text-slate-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                    {children}
                  </code>
                )
              },
              pre: ({ children }) => (
                <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg font-mono text-sm overflow-x-auto mb-4">
                  {children}
                </pre>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-blue-500 pl-4 italic text-slate-600 dark:text-slate-300 mb-4">
                  {children}
                </blockquote>
              ),
              strong: ({ children }) => (
                <strong className="font-semibold text-slate-800 dark:text-white">
                  {children}
                </strong>
              )
            }}
          >
            {lesson.content}
          </ReactMarkdown>
        </div>

        {/* Learning Objectives */}
        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">
            💡 What You&apos;ll Learn
          </h3>
          <p className="text-blue-700 dark:text-blue-300 text-sm">
            By the end of this lesson, you&apos;ll understand {lesson.title.toLowerCase()} and be able to implement it in your own projects.
          </p>
        </div>
      </Card>
    </motion.div>
  )
}