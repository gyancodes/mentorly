import { ChatInterface } from '../components/chat/chat-interface'
import { ProtectedRoute } from '../components/providers/session-provider'

export default function Home() {
  return (
    <ProtectedRoute>
      <div className="h-screen">
        <ChatInterface />
      </div>
    </ProtectedRoute>
  )
}
