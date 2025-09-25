'use client';

import { useState, useEffect } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  RotateCcw, 
  CheckCircle, 
  Clock,
  BookOpen,
  Target,
  Lightbulb,
  Award
} from 'lucide-react';
import { Lesson, LessonTrack } from '@/lib/lessons-data';
import MonacoCodeEditor from './monaco-code-editor';
import Breadcrumb from '../layout/breadcrumb';

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
  const [activeTab, setActiveTab] = useState<'instructions' | 'preview'>('instructions');
  const [code, setCode] = useState(currentLesson?.code || '');
  const [output, setOutput] = useState('');
  const [isValidated, setIsValidated] = useState(false);

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
    if (currentLesson.language === 'html') {
      setOutput(code);
    }
  };

  const resetCode = () => {
    setCode(currentLesson.code);
    setOutput('');
    setIsValidated(false);
  };

  const currentLessonIndex = track.lessons.findIndex(lesson => lesson.id === currentLesson.id);
  const nextLesson = track.lessons[currentLessonIndex + 1];
  const prevLesson = track.lessons[currentLessonIndex - 1];
  const progressPercentage = ((currentLessonIndex + 1) / track.lessons.length) * 100;

  const breadcrumbItems = [
    { label: 'Lessons', href: '/lessons' },
    { label: track.title, href: `/lessons/${track.id}` },
    { label: currentLesson.title }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <Breadcrumb items={breadcrumbItems} />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{currentLesson.title}</h1>
                <p className="text-gray-600">{track.title}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>{currentLesson.duration}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Target className="w-4 h-4" />
                <span className="capitalize">{currentLesson.difficulty}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Award className="w-4 h-4" />
                <span>{currentLessonIndex + 1} of {track.lessons.length}</span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>Course Progress</span>
              <span>{Math.round(progressPercentage)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex max-w-7xl mx-auto w-full">
        {/* Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          {/* Lesson Navigation */}
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Lessons ({track.lessons.length})
            </h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {track.lessons.map((lesson, index) => (
                <button
                  key={lesson.id}
                  onClick={() => onLessonChange(lesson.id)}
                  className={`w-full text-left p-3 rounded-lg transition-colors border ${
                    lesson.id === currentLesson.id
                      ? 'bg-blue-50 border-blue-200 text-blue-900'
                      : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className={`text-xs font-medium px-2 py-1 rounded ${
                        lesson.id === currentLesson.id
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {index + 1}
                      </span>
                      <span className="text-sm font-medium">{lesson.title}</span>
                    </div>
                    {index < currentLessonIndex && (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="p-6 mt-auto border-t border-gray-200">
            <div className="flex space-x-3">
              <button
                onClick={() => prevLesson && onLessonChange(prevLesson.id)}
                disabled={!prevLesson}
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 text-gray-700 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>
              <button
                onClick={() => nextLesson && onLessonChange(nextLesson.id)}
                disabled={!nextLesson}
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-500 text-white rounded-lg transition-colors"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <PanelGroup direction="horizontal" className="flex-1">
            {/* Code Editor Panel */}
            <Panel defaultSize={50} minSize={30}>
              <div className="h-full flex flex-col bg-white">
                {/* Editor Header */}
                <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Code Editor</h3>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={runCode}
                        className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
                      >
                        <Play className="w-4 h-4" />
                        <span>Run Code</span>
                      </button>
                      <button
                        onClick={resetCode}
                        className="flex items-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition-colors"
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span>Reset</span>
                      </button>
                    </div>
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

            <PanelResizeHandle className="w-1 bg-gray-200 hover:bg-gray-300 transition-colors" />

            {/* Instructions/Preview Panel */}
            <Panel defaultSize={50} minSize={30}>
              <div className="h-full flex flex-col bg-white">
                {/* Tab Header */}
                <div className="border-b border-gray-200">
                  <div className="flex">
                    <button
                      onClick={() => setActiveTab('instructions')}
                      className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === 'instructions'
                          ? 'border-blue-500 text-blue-600 bg-blue-50'
                          : 'border-transparent text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Instructions
                    </button>
                    <button
                      onClick={() => setActiveTab('preview')}
                      className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === 'preview'
                          ? 'border-blue-500 text-blue-600 bg-blue-50'
                          : 'border-transparent text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Preview
                    </button>
                  </div>
                </div>

                {/* Tab Content */}
                <div className="flex-1 overflow-auto">
                  {activeTab === 'instructions' ? (
                    <div className="p-6">
                      <div className="prose max-w-none">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">
                          {currentLesson.title}
                        </h2>
                        <div 
                          className="text-gray-700 leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: currentLesson.content }}
                        />
                        
                        {currentLesson.hints && currentLesson.hints.length > 0 && (
                          <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                            <div className="flex items-center space-x-2 mb-3">
                              <Lightbulb className="w-5 h-5 text-amber-600" />
                              <h3 className="text-sm font-semibold text-amber-800">Hints</h3>
                            </div>
                            <ul className="space-y-2">
                              {currentLesson.hints.map((hint, index) => (
                                <li key={index} className="text-sm text-amber-700">
                                  • {hint}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Live Preview</h3>
                      <div className="bg-white border border-gray-200 rounded-lg p-4 min-h-96">
                        {output ? (
                          <iframe
                            srcDoc={output}
                            className="w-full h-96 border-0"
                            title="Code Preview"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-96 text-gray-500">
                            Click "Run Code" to see your output
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Panel>
          </PanelGroup>
        </div>
      </div>
    </div>
  );
}