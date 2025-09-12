'use client'

import { useState } from 'react'
import { TypewriterEffect, TypewriterWordEffect } from '../ui/typewriter-effect'
import { Button } from '../ui/button'

const demoTexts = [
  "Hello! I'm your AI career mentor. I'm here to help you navigate your professional journey and unlock your full potential.",
  "Let's explore your career goals together. Whether you're looking for a new job, planning a career change, or seeking advancement in your current role, I can provide personalized guidance.",
  "Here are some areas I can help you with:\n\n• Resume optimization and review\n• Interview preparation and practice\n• Career path planning\n• Skill development recommendations\n• Networking strategies\n• Salary negotiation tips",
  "Ready to take the next step in your career? Let's start by discussing what you're hoping to achieve!"
]

export function TypingDemo() {
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [isTyping, setIsTyping] = useState(false)
  const [useWordEffect, setUseWordEffect] = useState(false)
  const [speed, setSpeed] = useState(30)

  const startTyping = () => {
    setIsTyping(true)
    setCurrentTextIndex(0)
  }

  const nextText = () => {
    if (currentTextIndex < demoTexts.length - 1) {
      setCurrentTextIndex(currentTextIndex + 1)
    } else {
      setIsTyping(false)
    }
  }

  const resetDemo = () => {
    setIsTyping(false)
    setCurrentTextIndex(0)
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Typing Effect Demo
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Experience the typewriter effect in action
        </p>
      </div>

      {/* Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          Controls
        </h2>
        <div className="flex flex-wrap gap-4 items-center">
          <Button 
            onClick={startTyping} 
            disabled={isTyping}
            className="bg-blue-500 hover:bg-blue-600"
          >
            {isTyping ? 'Typing...' : 'Start Demo'}
          </Button>
          
          <Button 
            onClick={resetDemo}
            variant="outline"
          >
            Reset
          </Button>

          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Effect Type:
            </label>
            <select 
              value={useWordEffect ? 'word' : 'character'}
              onChange={(e) => setUseWordEffect(e.target.value === 'word')}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              disabled={isTyping}
            >
              <option value="character">Character by Character</option>
              <option value="word">Word by Word</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Speed:
            </label>
            <input 
              type="range" 
              min="10" 
              max="100" 
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="w-20"
              disabled={isTyping}
            />
            <span className="text-sm text-gray-600 dark:text-gray-400 w-8">
              {speed}ms
            </span>
          </div>
        </div>
      </div>

      {/* Demo Area */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-lg p-8 border border-gray-200 dark:border-gray-700 min-h-[400px]">
        <div className="flex items-start space-x-4">
          {/* AI Avatar */}
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
          </div>

          {/* Message Content */}
          <div className="flex-1 bg-white dark:bg-gray-800 rounded-2xl px-6 py-4 shadow-sm border border-gray-200 dark:border-gray-700">
            {isTyping ? (
              <div className="space-y-4">
                {demoTexts.slice(0, currentTextIndex + 1).map((text, index) => (
                  <div key={index} className="text-gray-800 dark:text-gray-200 leading-relaxed">
                    {index === currentTextIndex ? (
                      useWordEffect ? (
                        <TypewriterWordEffect
                          text={text}
                          speed={speed * 4}
                          onComplete={nextText}
                        />
                      ) : (
                        <TypewriterEffect
                          text={text}
                          speed={speed}
                          onComplete={nextText}
                        />
                      )
                    ) : (
                      <div className="whitespace-pre-wrap">{text}</div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-500 dark:text-gray-400 italic text-center py-8">
                Click &quot;Start Demo&quot; to see the typing effect in action
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <div>
            <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
              Integration Note
            </h3>
            <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
              This typing effect is now integrated into the chat interface. New AI responses will automatically display with the typewriter effect.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}