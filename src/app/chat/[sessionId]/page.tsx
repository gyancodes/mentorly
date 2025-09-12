import { ChatInterface } from '../../../components/chat/chat-interface'
import { Header } from '../../../components/layout/header'

interface ChatPageProps {
  params: Promise<{
    sessionId: string
  }>
}

export default async function ChatPage({ params }: ChatPageProps) {
  const { sessionId } = await params
  return (
    <div className='h-screen flex flex-col'>
      <Header />
      <div className='flex-1'>
        <ChatInterface sessionId={sessionId} />
      </div>
    </div>
  )
}
