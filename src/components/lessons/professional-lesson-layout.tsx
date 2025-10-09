'use client';

import {
  ChevronLeft, 
  ChevronRight, 
  Play, 
  RotateCcw, 
  CheckCircle, 
  Clock,
  BookOpen,
  Lightbulb,
  Maximize2,
  Minimize2,
  Eye,
  Code,
  Menu,
  X
} from 'lucide-react';
import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import remarkGfm from 'remark-gfm';

import type { Lesson, LessonTrack } from '@/lib/lessons-data';

import MonacoCodeEditor from './monaco-code-editor';

interface ProfessionalLessonLayoutProps {
  track: LessonTrack;
  currentLesson: Lesson;
  onLessonChange: (lessonId: string) => void;
}

export default function ProfessionalLessonLayout({
  track,
  currentLesson,
  onLessonChange
}: ProfessionalLessonLayoutProps) {
  const [code, setCode] = useState(currentLesson?.code || '');
  const [output, setOutput] = useState('');
  const [_isValidated, setIsValidated] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [previewMaximized, setPreviewMaximized] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    if (currentLesson?.code) {
      setCode(currentLesson.code);
      setIsValidated(false);
      setOutput('');
    }
  }, [currentLesson?.code]);

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
  };

  const handleValidation = (isValid: boolean) => {
    setIsValidated(isValid);
  };

  const runCode = () => {
    setOutput(code);
  };

  const resetCode = () => {
    setCode(currentLesson.code);
    setOutput('');
    setIsValidated(false);
  };

  const currentLessonIndex = track.lessons.findIndex(lesson => lesson.id === currentLesson.id);
  const nextLesson = track.lessons[currentLessonIndex + 1];
  const prevLesson = track.lessons[currentLessonIndex - 1];
  // progressPercentage was unused

  return (
    <div className="h-screen bg-slate-950 flex flex-col overflow-hidden">
      {/* Compact Header */}
      <div className="bg-slate-900/80 backdrop-blur-sm border-b border-slate-800/50 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 rounded-lg transition-all duration-200"
          >
            <Menu className="w-4 h-4" />
          </button>
          
          <div className="flex items-center space-x-3">
            <span className="text-sm text-slate-300 font-medium">{track.title}</span>
            <ChevronRight className="w-3 h-3 text-slate-500" />
            <span className="text-sm text-slate-100 font-semibold">{currentLesson.title}</span>
              </div>
            </div>
            
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-xs text-slate-400 bg-slate-800/40 px-2 py-1 rounded-md">
            <Clock className="w-3 h-3" />
            <span>{currentLesson.estimatedTime}m</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowInstructions(!showInstructions)}
              className={`p-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                showInstructions 
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/25' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <BookOpen className="w-3 h-3" />
            </button>
            
            <button
              onClick={() => setPreviewMaximized(!previewMaximized)}
              className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 rounded-lg transition-all duration-200"
            >
              {previewMaximized ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Collapsible Sidebar */}
        {!sidebarCollapsed && (
          <div className="w-64 bg-slate-900/95 backdrop-blur-sm border-r border-slate-800/50 flex flex-col">
          {/* Lesson Navigation */}
            <div className="p-4 border-b border-slate-800/50">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
              Lessons ({track.lessons.length})
            </h3>
              <div className="space-y-1 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
              {track.lessons.map((lesson, index) => (
                <button
                  key={lesson.id}
                  onClick={() => onLessonChange(lesson.id)}
                    className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                    lesson.id === currentLesson.id
                        ? 'bg-emerald-600/90 text-white shadow-lg shadow-emerald-600/25'
                        : 'text-slate-300 hover:bg-slate-800/60 hover:text-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <span className={`text-xs font-medium px-2 py-1 rounded-md ${
                        lesson.id === currentLesson.id
                            ? 'bg-emerald-500/80 text-white'
                            : 'bg-slate-700/60 text-slate-300'
                      }`}>
                        {index + 1}
                      </span>
                        <span className="text-xs font-medium truncate">{lesson.title}</span>
                    </div>
                    {index < currentLessonIndex && (
                        <CheckCircle className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Navigation Controls */}
            <div className="p-4 mt-auto border-t border-slate-800/50">
              <div className="flex space-x-2">
              <button
                onClick={() => prevLesson && onLessonChange(prevLesson.id)}
                disabled={!prevLesson}
                  className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-slate-800/60 hover:bg-slate-700/60 disabled:bg-slate-800/30 disabled:text-slate-500 text-slate-300 text-xs rounded-lg transition-all duration-200"
              >
                  <ChevronLeft className="w-3 h-3" />
                  <span>Prev</span>
              </button>
              <button
                onClick={() => nextLesson && onLessonChange(nextLesson.id)}
                disabled={!nextLesson}
                  className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-800/30 disabled:text-slate-500 text-white text-xs rounded-lg transition-all duration-200 shadow-lg shadow-emerald-600/25"
              >
                <span>Next</span>
                  <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col bg-slate-950">
          <PanelGroup direction="horizontal" className="flex-1">
            {/* Code Editor Panel */}
            <Panel defaultSize={previewMaximized ? 100 : 60} minSize={30}>
              <div className="h-full flex flex-col bg-slate-950">
                {/* Compact Editor Header */}
                <div className="bg-slate-900/80 backdrop-blur-sm border-b border-slate-800/50 px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <Code className="w-4 h-4 text-slate-400" />
                      <span className="text-sm text-slate-200 font-medium">index.html</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                      <button
                        onClick={runCode}
                      className="flex items-center space-x-2 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-lg transition-all duration-200 shadow-lg shadow-emerald-600/25"
                      >
                      <Play className="w-3 h-3" />
                      <span>Run</span>
                      </button>
                      <button
                        onClick={resetCode}
                      className="flex items-center space-x-2 px-3 py-1.5 bg-slate-800/60 hover:bg-slate-700/60 text-slate-300 text-xs font-medium rounded-lg transition-all duration-200"
                      >
                      <RotateCcw className="w-3 h-3" />
                        <span>Reset</span>
                      </button>
                  </div>
                </div>

                {/* Monaco Editor */}
                <div className="flex-1">
                  <MonacoCodeEditor
                    lesson={currentLesson}
                    language="html"
                    onCodeChange={handleCodeChange}
                    onValidation={handleValidation}
                    className="h-full"
                  />
                </div>
              </div>
            </Panel>

            {!previewMaximized && (
              <>
                <PanelResizeHandle className="w-1 bg-slate-800/50 hover:bg-slate-700/50 transition-all duration-200" />

                {/* Preview Panel */}
                <Panel defaultSize={40} minSize={20}>
                  <div className="h-full flex flex-col bg-slate-950">
                    {/* Compact Preview Header */}
                    <div className="bg-slate-900/80 backdrop-blur-sm border-b border-slate-800/50 px-4 py-3 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Eye className="w-4 h-4 text-slate-400" />
                        <span className="text-sm text-slate-200 font-medium">Preview</span>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                    <button
                          onClick={() => setPreviewMaximized(true)}
                          className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 rounded-lg transition-all duration-200"
                        >
                          <Maximize2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                    {/* Preview Content */}
                    <div className="flex-1 bg-white overflow-auto">
                      {output ? (
                        <iframe
                          srcDoc={output}
                          className="w-full h-full border-0"
                          title="Code Preview"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-slate-500">
                          <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
                              <Play className="w-8 h-8 text-slate-400" />
                            </div>
                            <p className="text-sm text-slate-400">Click &quot;Run&quot; to see your code</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </Panel>
              </>
            )}
          </PanelGroup>
        </div>
      </div>

      {/* Floating Instructions Panel */}
      {showInstructions && (
        <div className="fixed inset-y-0 right-0 w-96 bg-slate-900/95 backdrop-blur-sm border-l border-slate-800/50 shadow-2xl z-50 overflow-hidden">
          <div className="h-full flex flex-col">
            {/* Instructions Header */}
            <div className="bg-slate-800/80 border-b border-slate-800/50 px-4 py-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-100">Instructions</h3>
              <button
                onClick={() => setShowInstructions(false)}
                className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-700/60 rounded-lg transition-all duration-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Instructions Content */}
            <div className="flex-1 overflow-auto p-4 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
              <div className="prose prose-sm max-w-none prose-invert">
                <h2 className="text-lg font-bold text-slate-100 mb-4">
                  {currentLesson.title}
                </h2>
                
                {/* Render Markdown content properly */}
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({ children }) => (
                      <h1 className="text-xl font-bold text-slate-100 mt-6 mb-3">
                        {children}
                      </h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="text-lg font-semibold text-slate-100 mt-5 mb-2">
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-base font-semibold text-slate-100 mt-4 mb-2">
                        {children}
                      </h3>
                    ),
                    p: ({ children }) => (
                      <p className="text-slate-300 mb-3 leading-relaxed">
                        {children}
                      </p>
                    ),
                    ul: ({ children }) => (
                      <ul className="list-disc list-inside text-slate-300 mb-3 space-y-1 ml-4">
                        {children}
                      </ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="list-decimal list-inside text-slate-300 mb-3 space-y-1 ml-4">
                        {children}
                      </ol>
                    ),
                    li: ({ children }) => (
                      <li className="text-slate-300">
                        {children}
                      </li>
                    ),
                    code: ({ children, className }) => {
                      const isInline = !className
                      if (isInline) {
                        return (
                          <code className="bg-slate-800 text-slate-200 px-2 py-1 rounded text-sm font-mono">
                            {children}
                          </code>
                        )
                      }
                      return (
                        <code className="block bg-slate-900 text-slate-100 p-3 rounded-lg font-mono text-sm overflow-x-auto my-3">
                          {children}
                        </code>
                      )
                    },
                    pre: ({ children }) => (
                      <pre className="bg-slate-900 text-slate-100 p-3 rounded-lg font-mono text-sm overflow-x-auto mb-3">
                        {children}
                      </pre>
                    ),
                    strong: ({ children }) => (
                      <strong className="font-semibold text-slate-100">
                        {children}
                      </strong>
                    ),
                    em: ({ children }) => (
                      <em className="italic text-slate-200">
                        {children}
                      </em>
                    ),
                    table: ({ children }) => (
                      <div className="overflow-x-auto my-4">
                        <table className="min-w-full border border-slate-700 rounded-lg">
                          {children}
                        </table>
                      </div>
                    ),
                    thead: ({ children }) => (
                      <thead className="bg-slate-800">
                        {children}
                      </thead>
                    ),
                    tbody: ({ children }) => (
                      <tbody className="bg-slate-900">
                        {children}
                      </tbody>
                    ),
                    tr: ({ children }) => (
                      <tr className="border-b border-slate-700">
                        {children}
                      </tr>
                    ),
                    th: ({ children }) => (
                      <th className="px-4 py-2 text-left text-slate-200 font-semibold">
                        {children}
                      </th>
                    ),
                    td: ({ children }) => (
                      <td className="px-4 py-2 text-slate-300">
                        {children}
                      </td>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-emerald-500 pl-4 italic text-slate-300 my-4">
                        {children}
                      </blockquote>
                    )
                  }}
                >
                  {currentLesson.content}
                </ReactMarkdown>
                        
                        {currentLesson.hints && currentLesson.hints.length > 0 && (
                  <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                            <div className="flex items-center space-x-2 mb-3">
                      <Lightbulb className="w-4 h-4 text-amber-400" />
                      <h3 className="text-sm font-semibold text-amber-300">Hints</h3>
                            </div>
                            <ul className="space-y-2">
                              {currentLesson.hints.map((hint, index) => (
                        <li key={index} className="text-sm text-amber-200 flex items-start">
                          <span className="text-amber-400 mr-2">•</span>
                          <span>{hint}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                      </div>
                    </div>
                  )}
    </div>
  );
}