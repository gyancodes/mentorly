'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Play, RotateCcw, Check, X, Lightbulb } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import hljs from 'highlight.js/lib/core'
import xml from 'highlight.js/lib/languages/xml' // for HTML
import 'highlight.js/styles/github-dark.css'

// Register HTML language
hljs.registerLanguage('html', xml)

interface CodeEditorProps {
  initialCode: string
  expectedOutput: string
  language: 'html' | 'css' | 'javascript'
  onCodeChange?: (code: string) => void
  onValidation?: (isCorrect: boolean) => void
  hints?: string[]
}

export default function CodeEditor({
  initialCode,
  expectedOutput,
  language,
  onCodeChange,
  onValidation,
  hints = []
}: CodeEditorProps) {
  const [code, setCode] = useState(initialCode)
  const [output, setOutput] = useState('')
  const [isCorrect, setIsCorrect] = useState(false)
  const [showHints, setShowHints] = useState(false)
  const [currentHint, setCurrentHint] = useState(0)

  useEffect(() => {
    // Highlight code when it changes
    const codeElement = document.querySelector('.code-editor pre code')
    if (codeElement) {
      hljs.highlightElement(codeElement as HTMLElement)
    }
  }, [code])

  const handleCodeChange = (newCode: string) => {
    setCode(newCode)
    onCodeChange?.(newCode)
    
    // Auto-validate for HTML
    if (language === 'html') {
      setOutput(newCode)
      const correct = normalizeHTML(newCode) === normalizeHTML(expectedOutput)
      setIsCorrect(correct)
      onValidation?.(correct)
    }
  }

  const normalizeHTML = (html: string) => {
    return html
      .replace(/\s+/g, ' ')
      .replace(/>\s+</g, '><')
      .trim()
      .toLowerCase()
  }

  const runCode = () => {
    if (language === 'html') {
      setOutput(code)
      const correct = normalizeHTML(code) === normalizeHTML(expectedOutput)
      setIsCorrect(correct)
      onValidation?.(correct)
    }
  }

  const resetCode = () => {
    setCode(initialCode)
    setOutput('')
    setIsCorrect(false)
    setShowHints(false)
    setCurrentHint(0)
  }

  const showNextHint = () => {
    if (!showHints) {
      setShowHints(true)
      setCurrentHint(0)
    } else if (currentHint < hints.length - 1) {
      setCurrentHint(currentHint + 1)
    }
  }

  return (
    <div className="space-y-4">
      {/* Code Editor */}
      <Card className="p-4 bg-slate-900 border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Code Editor</h3>
          <div className="flex gap-2">
            <Button
              onClick={showNextHint}
              variant="outline"
              size="sm"
              className="bg-yellow-500/10 border-yellow-500/20 text-yellow-400 hover:bg-yellow-500/20"
            >
              <Lightbulb className="w-4 h-4 mr-1" />
              Hint {showHints ? `(${currentHint + 1}/${hints.length})` : ''}
            </Button>
            <Button
              onClick={resetCode}
              variant="outline"
              size="sm"
              className="bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600"
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              Reset
            </Button>
            <Button
              onClick={runCode}
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Play className="w-4 h-4 mr-1" />
              Run
            </Button>
          </div>
        </div>

        {/* Hints */}
        {showHints && hints.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg"
          >
            <div className="flex items-start gap-2">
              <Lightbulb className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
              <p className="text-yellow-200 text-sm">{hints[currentHint]}</p>
            </div>
          </motion.div>
        )}

        {/* Code Input */}
        <div className="code-editor relative">
          <textarea
            value={code}
            onChange={(e) => handleCodeChange(e.target.value)}
            className="w-full h-64 p-4 bg-slate-800 text-slate-100 font-mono text-sm border border-slate-600 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={`Enter your ${language.toUpperCase()} code here...`}
            spellCheck={false}
          />
          
          {/* Syntax highlighting overlay */}
          <pre className="absolute inset-0 p-4 pointer-events-none overflow-hidden">
            <code className={`language-${language} text-transparent`}>
              {code}
            </code>
          </pre>
        </div>
      </Card>

      {/* Output Preview */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
            Live Preview
          </h3>
          {output && (
            <div className="flex items-center gap-2">
              {isCorrect ? (
                <div className="flex items-center gap-1 text-green-600">
                  <Check className="w-4 h-4" />
                  <span className="text-sm font-medium">Correct!</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-red-600">
                  <X className="w-4 h-4" />
                  <span className="text-sm font-medium">Try again</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* HTML Preview */}
        {language === 'html' && output && (
          <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 bg-white dark:bg-slate-800 min-h-32">
            <div dangerouslySetInnerHTML={{ __html: output }} />
          </div>
        )}

        {/* No output message */}
        {!output && (
          <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 bg-slate-50 dark:bg-slate-800 min-h-32 flex items-center justify-center">
            <p className="text-slate-500 dark:text-slate-400">
              Click "Run" to see your code in action!
            </p>
          </div>
        )}
      </Card>

      {/* Success Animation */}
      {isCorrect && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="fixed inset-0 flex items-center justify-center pointer-events-none z-50"
        >
          <div className="bg-green-500 text-white p-6 rounded-full shadow-2xl">
            <Check className="w-12 h-12" />
          </div>
        </motion.div>
      )}
    </div>
  )
}