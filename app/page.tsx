"use client"

import { useState } from "react"
import { ChatSidebar } from "@/components/chat-sidebar"
import { ChatMain } from "@/components/chat-main"

export interface Conversation {
  id: string
  title: string
  createdAt: Date
}

export default function ChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const handleNewChat = () => {
    const newConversation: Conversation = {
      id: crypto.randomUUID(),
      title: "New chat",
      createdAt: new Date(),
    }
    setConversations((prev) => [newConversation, ...prev])
    setActiveConversationId(newConversation.id)
  }

  const handleSelectConversation = (id: string) => {
    setActiveConversationId(id)
  }

  const handleDeleteConversation = (id: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== id))
    if (activeConversationId === id) {
      setActiveConversationId(null)
    }
  }

  const handleUpdateTitle = (id: string, title: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, title } : c))
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <ChatSidebar
        conversations={conversations}
        activeId={activeConversationId}
        onNewChat={handleNewChat}
        onSelect={handleSelectConversation}
        onDelete={handleDeleteConversation}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      <ChatMain
        conversationId={activeConversationId}
        onUpdateTitle={(title) => {
          if (activeConversationId) {
            handleUpdateTitle(activeConversationId, title)
          }
        }}
        onNewChat={handleNewChat}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />
    </div>
  )
}
