"use client"

import { Plus, Scroll, Trash2, PanelLeftClose, Anchor } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import type { Conversation } from "@/app/page"

interface ChatSidebarProps {
  conversations: Conversation[]
  activeId: string | null
  onNewChat: () => void
  onSelect: (id: string) => void
  onDelete: (id: string) => void
  isOpen: boolean
  onToggle: () => void
}

export function ChatSidebar({
  conversations,
  activeId,
  onNewChat,
  onSelect,
  onDelete,
  isOpen,
  onToggle,
}: ChatSidebarProps) {
  return (
    <aside
      className={cn(
        "flex flex-col bg-sidebar transition-all duration-300 ease-in-out",
        isOpen ? "w-64" : "w-0 overflow-hidden"
      )}
    >
      <div className="flex items-center justify-between p-4">
        <Button
          onClick={onNewChat}
          className="flex-1 gap-2"
          variant="outline"
        >
          <Plus className="h-4 w-4" />
          New Voyage
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="ml-2 text-sidebar-foreground"
        >
          <PanelLeftClose className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 flex flex-col gap-1">
          {conversations.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8 px-4 italic">
              No voyages charted yet. Start a new one, ye scallywag!
            </p>
          ) : (
            conversations.map((conversation) => (
              <div
                key={conversation.id}
                className={cn(
                  "group flex items-center gap-2 rounded-lg px-3 py-2 text-sm cursor-pointer transition-colors",
                  activeId === conversation.id
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "hover:bg-sidebar-accent/50 text-sidebar-foreground"
                )}
                onClick={() => onSelect(conversation.id)}
              >
                <Scroll className="h-4 w-4 shrink-0 text-accent" />
                <span className="flex-1 truncate">{conversation.title}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDelete(conversation.id)
                  }}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      <div className="p-4">
        <div className="flex items-center justify-center gap-2">
          <Anchor className="h-3 w-3 text-primary" />
          <p className="text-xs text-muted-foreground text-center italic">
            Sail the digital seas
          </p>
          <Anchor className="h-3 w-3 text-primary" />
        </div>
      </div>
    </aside>
  )
}
