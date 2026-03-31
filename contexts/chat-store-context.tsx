"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { ChatMessage } from "@/lib/types";
import {
  deleteStoredChat,
  getAllChats,
  getStoredChat,
  type StoredChat,
  updateChatMessages,
} from "@/lib/storage/session-storage";

interface ChatStoreContextType {
  chats: StoredChat[];
  getChat: (chatId: string) => StoredChat | null;
  updateChat: (chatId: string, messages: ChatMessage[], title?: string) => void;
  deleteChat: (chatId: string) => void;
  refreshChats: () => void;
}

const ChatStoreContext = createContext<ChatStoreContextType | null>(null);

export function ChatStoreProvider({ children }: { children: ReactNode }) {
  const [chats, setChats] = useState<StoredChat[]>([]);

  // Load chats from sessionStorage on mount
  useEffect(() => {
    setChats(getAllChats());
  }, []);

  const refreshChats = useCallback(() => {
    setChats(getAllChats());
  }, []);

  const getChat = useCallback((chatId: string): StoredChat | null => {
    return getStoredChat(chatId);
  }, []);

  const updateChat = useCallback(
    (chatId: string, messages: ChatMessage[], title?: string) => {
      updateChatMessages(chatId, messages, title);
      refreshChats();
    },
    [refreshChats]
  );

  const deleteChat = useCallback(
    (chatId: string) => {
      deleteStoredChat(chatId);
      refreshChats();
    },
    [refreshChats]
  );

  return (
    <ChatStoreContext.Provider
      value={{
        chats,
        getChat,
        updateChat,
        deleteChat,
        refreshChats,
      }}
    >
      {children}
    </ChatStoreContext.Provider>
  );
}

export function useChatStore() {
  const context = useContext(ChatStoreContext);
  if (!context) {
    throw new Error("useChatStore must be used within a ChatStoreProvider");
  }
  return context;
}
