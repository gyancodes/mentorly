'use client';

import { useParams, useSearchParams } from 'next/navigation';

import ProfessionalLessonLayout from '@/components/lessons/professional-lesson-layout';
import { lessonTracks } from '@/lib/lessons-data';
import '@/styles/lessons-dark.css';

export default function LessonTrackPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const trackId = params.trackId as string;
  
  const track = lessonTracks.find(t => t.id === trackId);
  const lessonId = searchParams.get('lesson') || track?.lessons[0]?.id;
  const currentLesson = track?.lessons.find(l => l.id === lessonId);

  if (!track) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Track not found</h1>
          <p className="text-gray-600">The lesson track you&apos;re looking for doesn&apos;t exist.</p>
        </div>
      </div>
    );
  }

  if (!currentLesson) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Lesson not found</h1>
          <p className="text-gray-600">The lesson you&apos;re looking for doesn&apos;t exist.</p>
        </div>
      </div>
    );
  }

  const handleLessonChange = (newLessonId: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set('lesson', newLessonId);
    window.history.pushState({}, '', url.toString());
    window.location.reload();
  };

  return (
    <div className="h-screen overflow-hidden">
      <ProfessionalLessonLayout
        track={track}
        currentLesson={currentLesson}
        onLessonChange={handleLessonChange}
      />
    </div>
  );
}