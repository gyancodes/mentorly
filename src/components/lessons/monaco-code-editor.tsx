'use client'

import Editor, { type Monaco } from '@monaco-editor/react'
import { motion } from 'framer-motion'
import { CheckCircle } from 'lucide-react'
import type { editor } from 'monaco-editor'
import React, { useState, useEffect, useRef, useCallback } from 'react'

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
  const [isValid, setIsValid] = useState(false)
  // Removed unused UI states
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)

  const validateHTML = useCallback((htmlCode: string): boolean => {
    const normalizedCode = htmlCode.replace(/\s+/g, ' ').trim().toLowerCase()
    const normalizedExpected = lesson.expectedOutput.replace(/\s+/g, ' ').trim().toLowerCase()
    return normalizedCode.includes(normalizedExpected) || normalizedCode === normalizedExpected
  }, [lesson.expectedOutput])

  useEffect(() => {
    onCodeChange(value)
    const valid = validateHTML(value)
    setIsValid(valid)
    onValidation(valid)
  }, [value, onCodeChange, onValidation, validateHTML])

  const handleEditorDidMount = (editorInstance: editor.IStandaloneCodeEditor, monaco: Monaco) => {
    editorRef.current = editorInstance

    // Configure Monaco Editor options
    editorInstance.updateOptions({
      fontSize: 14,
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
        provideCompletionItems: (model, position) => {
          const word = model.getWordUntilPosition(position);
          const range = {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: word.startColumn,
            endColumn: word.endColumn
          };
          
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
              documentation: 'HTML5 boilerplate',
              range: range
            },
            {
              label: 'div',
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: '<div>$1</div>',
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: 'Div element',
              range: range
            },
            {
              label: 'p',
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: '<p>$1</p>',
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: 'Paragraph element',
              range: range
            }
          ]
          return { suggestions }
        }
      })
    }
  }

  // Removed unused actions (run/reset/format/copy/download and hint navigation)

  return (
    <div className={`flex flex-col h-full bg-slate-950 ${className}`}>
      {/* Editor */}
      <div className="flex-1 relative">
        <Editor
          height="100%"
          language={language}
          value={value}
          theme="vs-dark"
          onChange={(newValue) => setValue(newValue || '')}
          onMount={handleEditorDidMount}
          options={{
            fontSize: 14,
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
            lineDecorationsWidth: 8,
            lineNumbersMinChars: 3,
            renderLineHighlight: 'all',
            selectOnLineNumbers: true,
            bracketPairColorization: { enabled: true },
            padding: { top: 12, bottom: 12 },
            scrollbar: {
              vertical: 'auto',
              horizontal: 'auto',
              verticalScrollbarSize: 8,
              horizontalScrollbarSize: 8
            },
            cursorStyle: 'line',
            cursorBlinking: 'smooth',
            renderWhitespace: 'selection',
            guides: {
              indentation: true,
              bracketPairs: true
            }
          }}
        />
        
        {/* Success Indicator */}
        {isValid && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute top-4 right-4 flex items-center space-x-2 bg-emerald-600 text-white px-3 py-2 rounded-lg text-xs font-medium shadow-lg shadow-emerald-600/25"
          >
            <CheckCircle className="w-3 h-3" />
            <span>Correct!</span>
          </motion.div>
        )}
      </div>
    </div>
  )
}