"use client"

import { useState, useRef, useEffect } from "react"
import { PanelLeft, Send, Anchor, Skull } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

interface ChatMainProps {
  conversationId: string | null
  onUpdateTitle: (title: string) => void
  onNewChat: () => void
  sidebarOpen: boolean
  onToggleSidebar: () => void
}

async function sendMessageToBackend(userMessage: string): Promise<string> {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: userMessage }),
  })
  const data = await res.json()
  return data.response
}

export function ChatMain({
  conversationId,
  onUpdateTitle,
  onNewChat,
  sidebarOpen,
  onToggleSidebar,
}: ChatMainProps) {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const hasSetTitle = useRef(false)
  const prevConversationId = useRef<string | null>(conversationId)

  // Clear messages when switching to a different existing conversation
  useEffect(() => {
    if (conversationId !== prevConversationId.current) {
      // Only clear if switching to an existing conversation (not when creating new)
      if (conversationId !== null && prevConversationId.current !== null) {
        setMessages([])
        hasSetTitle.current = false
      }
      prevConversationId.current = conversationId
    }
  }, [conversationId])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`
    }
  }, [input])

  // Update conversation title based on first user message
  useEffect(() => {
    if (messages.length > 0 && !hasSetTitle.current) {
      const firstUserMessage = messages.find((m) => m.role === "user")
      if (firstUserMessage) {
        const text = firstUserMessage.content
        if (text) {
          onUpdateTitle(text.slice(0, 30) + (text.length > 30 ? "..." : ""))
          hasSetTitle.current = true
        }
      }
    }
  }, [messages, onUpdateTitle])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const messageContent = input.trim()
    setInput("")

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageContent,
    }

    setMessages((prev) => [...prev, userMessage])
    
    // Create new conversation if this is the first message
    if (!conversationId) {
      onNewChat()
    }
    
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
    }

    setIsLoading(true)
    try {
      const response = await sendMessageToBackend(userMessage.content)
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
      }
      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Failed to send message:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, something went wrong. Please try again.",
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <main className="flex-1 flex flex-col min-w-0">
      {/* Header */}
      <header className="flex items-center gap-2 px-4 py-3">
        {!sidebarOpen && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
          >
            <PanelLeft className="h-4 w-4" />
          </Button>
        )}
        <h1 className="font-semibold text-primary tracking-wide">The Crow's Nest</h1>
      </header>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto w-full">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[60vh] px-4">
              <div className="w-20 h-20 rounded-full border-2 border-primary bg-secondary flex items-center justify-center mb-6">
                <Skull className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-3xl font-semibold text-primary mb-2 text-balance text-center tracking-wide">
                What say ye, sailor?
              </h2>
              <p className="text-muted-foreground text-center max-w-md italic">
                Speak yer question into the winds and the spirits of the deep shall answer. Dead men tell no tales — but I do.
              </p>
            </div>
          ) : (
            <div className="flex flex-col py-4">
              {messages.map((message) => (
                <div key={message.id} className="px-4 py-6">
                  <div className="flex gap-4">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                      message.role === "user"
                        ? "bg-secondary"
                        : "bg-primary"
                    )}>
                      {message.role === "user" ? (
                        <Anchor className="w-4 h-4 text-foreground" />
                      ) : (
                        <Skull className="w-4 h-4 text-primary-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0 overflow-hidden">
                      <div className="font-semibold text-sm text-primary mb-1 tracking-wide">
                        {message.role === "user" ? "The Captain" : "Jack Sparrow"}
                      </div>
                      <div className="prose prose-sm dark:prose-invert max-w-none text-foreground break-words whitespace-pre-wrap">
                        {message.content}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="px-4 py-6">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                      <Skull className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          )}
        </div>
      </div>

      {/* Input */}
      <div className="p-4">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
          <div className="relative flex items-end gap-2 bg-input rounded-2xl p-2">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Speak yer message into the abyss..."
              className={cn(
                "flex-1 resize-none border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 min-h-[44px] max-h-[200px] py-3 px-2",
                "scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent"
              )}
              rows={1}
              disabled={isLoading}
            />
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || isLoading}
              className="shrink-0 h-10 w-10 rounded-xl"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground text-center mt-2">
            The seas are treacherous. Verify yer bearings before trustin' the spirits.
          </p>
        </form>
      </div>
    </main>
  )
}
