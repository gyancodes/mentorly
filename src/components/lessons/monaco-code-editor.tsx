'use client'

import React, { useState, useEffect, useRef } from 'react'
import Editor from '@monaco-editor/react'
import { motion } from 'framer-motion'
import { Play, RotateCcw, Settings, CheckCircle, Lightbulb, Copy, Download } from 'lucide-react'

interface MonacoCodeEditorProps {
  lesson: {
    code: string
    expectedOutput: string
    hints: string[]
  }
  language: string
  onCodeChange: (code: string) => void
  onValidation: (isValid: boolean) => void
  className?: string
}

export default function MonacoCodeEditor({
  lesson,
  language,
  onCodeChange,
  onValidation,
  className = ''
}: MonacoCodeEditorProps) {
  const [value, setValue] = useState(lesson.code)
  const [output, setOutput] = useState('')
  const [isValid, setIsValid] = useState(false)
  const [showHints, setShowHints] = useState(false)
  const [currentHintIndex, setCurrentHintIndex] = useState(0)
  const [theme, setTheme] = useState<'vs-dark' | 'light'>('vs-dark')
  const [fontSize, setFontSize] = useState(14)
  const [showSettings, setShowSettings] = useState(false)
  const editorRef = useRef<any>(null)

  useEffect(() => {
    onCodeChange(value)
    const valid = validateHTML(value)
    setIsValid(valid)
    onValidation(valid)
  }, [value, onCodeChange, onValidation])

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor

    // Configure Monaco Editor options
    editor.updateOptions({
      fontSize: fontSize,
      fontFamily: 'JetBrains Mono, Consolas, Monaco, monospace',
      lineNumbers: 'on',
      roundedSelection: false,
      scrollBeyondLastLine: false,
      automaticLayout: true,
      minimap: { enabled: false },
      wordWrap: 'on',
      tabSize: 2,
      insertSpaces: true,
      folding: true,
      lineDecorationsWidth: 10,
      lineNumbersMinChars: 3,
      renderLineHighlight: 'all',
      selectOnLineNumbers: true,
      bracketPairColorization: { enabled: true },
      guides: {
        bracketPairs: true,
        indentation: true
      }
    })

    // Add custom HTML snippets and autocomplete
    if (language === 'html') {
      monaco.languages.registerCompletionItemProvider('html', {
        provideCompletionItems: (model: any, position: any) => {
          const suggestions = [
            {
              label: 'html5',
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: [
                '<!DOCTYPE html>',
                '<html lang="en">',
                '<head>',
                '    <meta charset="UTF-8">',
                '    <meta name="viewport" content="width=device-width, initial-scale=1.0">',
                '    <title>$1</title>',
                '</head>',
                '<body>',
                '    $2',
                '</body>',
                '</html>'
              ].join('\n'),
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: 'HTML5 boilerplate'
            },
            {
              label: 'div',
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: '<div>$1</div>',
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: 'Div element'
            },
            {
              label: 'p',
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: '<p>$1</p>',
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: 'Paragraph element'
            }
          ]
          return { suggestions }
        }
      })
    }
  }

  const runCode = () => {
    if (language === 'html') {
      setOutput(value)
      const isCodeValid = validateHTML(value)
      setIsValid(isCodeValid)
      onValidation(isCodeValid)
    }
    onCodeChange(value)
  }

  const validateHTML = (htmlCode: string): boolean => {
    const normalizedCode = htmlCode.replace(/\s+/g, ' ').trim().toLowerCase()
    const normalizedExpected = lesson.expectedOutput.replace(/\s+/g, ' ').trim().toLowerCase()
    return normalizedCode.includes(normalizedExpected) || normalizedCode === normalizedExpected
  }

  const resetCode = () => {
    setValue(lesson.code)
    setOutput('')
    setIsValid(false)
    setShowHints(false)
    setCurrentHintIndex(0)
    onValidation(false)
    if (editorRef.current) {
      editorRef.current.setValue(lesson.code)
    }
  }

  const formatCode = () => {
    if (editorRef.current) {
      editorRef.current.getAction('editor.action.formatDocument').run()
    }
  }

  const copyCode = () => {
    navigator.clipboard.writeText(value)
  }

  const downloadCode = () => {
    const blob = new Blob([value], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `lesson-code.${language}`
    a.click()
    URL.revokeObjectURL(url)
  }

  const nextHint = () => {
    if (currentHintIndex < lesson.hints.length - 1) {
      setCurrentHintIndex(currentHintIndex + 1)
    }
  }

  const prevHint = () => {
    if (currentHintIndex > 0) {
      setCurrentHintIndex(currentHintIndex - 1)
    }
  }

  return (
    <div className={`flex flex-col h-full bg-gray-50 dark:bg-gray-900 ${className}`}>
      {/* Toolbar */}
      <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <motion.button
            onClick={runCode}
            className="flex items-center space-x-2 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-medium transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Play className="w-4 h-4" />
            <span>Run</span>
          </motion.button>
          
          <motion.button
            onClick={resetCode}
            className="flex items-center space-x-2 px-3 py-1.5 bg-gray-600 hover:bg-gray-700 text-white rounded-md text-sm font-medium transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </motion.button>

          <motion.button
            onClick={formatCode}
            className="flex items-center space-x-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span>Format</span>
          </motion.button>
        </div>

        <div className="flex items-center space-x-2">
          {lesson.hints.length > 0 && (
            <motion.button
              onClick={() => setShowHints(!showHints)}
              className="flex items-center space-x-2 px-3 py-1.5 bg-yellow-600 hover:bg-yellow-700 text-white rounded-md text-sm font-medium transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Lightbulb className="w-4 h-4" />
              <span>Hints</span>
            </motion.button>
          )}

          <motion.button
            onClick={copyCode}
            className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Copy className="w-4 h-4" />
          </motion.button>

          <motion.button
            onClick={downloadCode}
            className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Download className="w-4 h-4" />
          </motion.button>

          <motion.button
            onClick={() => setShowSettings(!showSettings)}
            className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Settings className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="p-3 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Theme:</label>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value as 'vs-dark' | 'light')}
                className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="vs-dark">Dark</option>
                <option value="light">Light</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Font Size:</label>
              <select
                value={fontSize}
                onChange={(e) => {
                  const newSize = parseInt(e.target.value)
                  setFontSize(newSize)
                  if (editorRef.current) {
                    editorRef.current.updateOptions({ fontSize: newSize })
                  }
                }}
                className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="12">12px</option>
                <option value="14">14px</option>
                <option value="16">16px</option>
                <option value="18">18px</option>
              </select>
            </div>
          </div>
        </motion.div>
      )}

      {/* Hints Panel */}
      {showHints && lesson.hints.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border-b border-yellow-200 dark:border-yellow-800"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Lightbulb className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
              <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                Hint {currentHintIndex + 1} of {lesson.hints.length}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={prevHint}
                disabled={currentHintIndex === 0}
                className="px-2 py-1 text-xs bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 rounded disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={nextHint}
                disabled={currentHintIndex === lesson.hints.length - 1}
                className="px-2 py-1 text-xs bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
          <p className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
            {lesson.hints[currentHintIndex]}
          </p>
        </motion.div>
      )}

      {/* Editor */}
      <div className="flex-1 relative">
        <Editor
          height="100%"
          language={language}
          value={value}
          theme={theme}
          onChange={(newValue) => setValue(newValue || '')}
          onMount={handleEditorDidMount}
          options={{
            fontSize: fontSize,
            fontFamily: 'JetBrains Mono, Consolas, Monaco, monospace',
            lineNumbers: 'on',
            roundedSelection: false,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            minimap: { enabled: false },
            wordWrap: 'on',
            tabSize: 2,
            insertSpaces: true,
            folding: true,
            lineDecorationsWidth: 10,
            lineNumbersMinChars: 3,
            renderLineHighlight: 'all',
            selectOnLineNumbers: true,
            bracketPairColorization: { enabled: true }
          }}
        />
        
        {/* Success Indicator */}
        {isValid && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute top-4 right-4 flex items-center space-x-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 px-3 py-2 rounded-lg shadow-lg"
          >
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm font-medium">Correct!</span>
          </motion.div>
        )}
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-600 dark:text-gray-400">
        <div className="flex items-center space-x-4">
          <span>Language: {language.toUpperCase()}</span>
          <span>Lines: {value.split('\n').length}</span>
          <span>Characters: {value.length}</span>
        </div>
        <div className="flex items-center space-x-2">
          {isValid ? (
            <span className="text-green-600 dark:text-green-400 font-medium">✓ Valid</span>
          ) : (
            <span className="text-gray-500">Ready</span>
          )}
        </div>
      </div>
    </div>
  )
}