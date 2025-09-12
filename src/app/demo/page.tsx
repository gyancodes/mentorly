import { TypingDemo } from '../../components/demo/typing-demo'

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <TypingDemo />
    </div>
  )
}

export const metadata = {
  title: 'Typing Effect Demo - Mentorly',
  description: 'Interactive demo of the typewriter effect used in Mentorly chat interface',
}