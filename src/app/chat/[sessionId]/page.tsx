import { ChatInterface } from '../../../components/chat/chat-interface'
import { Header } from '../../../components/layout/header'

interface ChatPageProps {
  params: {
    sessionId: string
  }
}

export default function ChatPage({ params }: ChatPageProps) {
  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex-1">
        <ChatInterface sessionId={params.sessionId} />
      </div>
    </div>
  )
}