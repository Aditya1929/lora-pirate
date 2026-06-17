import type { ChatMessage } from "@/lib/types";

const CHATS_STORAGE_KEY = "lora-pirate-chats";

export interface StoredChat {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface ChatsStorage {
  chats: Record<string, StoredChat>;
}

// Check if we're in a browser environment
const isBrowser = typeof window !== "undefined";

export function getStoredChats(): ChatsStorage {
  if (!isBrowser) {
    return { chats: {} };
  }
  
  try {
    const stored = sessionStorage.getItem(CHATS_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error("Failed to parse stored chats:", e);
  }
  return { chats: {} };
}

export function saveChatsToStorage(storage: ChatsStorage): void {
  if (!isBrowser) return;
  
  try {
    sessionStorage.setItem(CHATS_STORAGE_KEY, JSON.stringify(storage));
  } catch (e) {
    console.error("Failed to save chats to storage:", e);
  }
}

export function getStoredChat(chatId: string): StoredChat | null {
  const storage = getStoredChats();
  return storage.chats[chatId] || null;
}

export function saveChat(chat: StoredChat): void {
  const storage = getStoredChats();
  storage.chats[chat.id] = chat;
  saveChatsToStorage(storage);
}

export function updateChatMessages(chatId: string, messages: ChatMessage[], title?: string): void {
  const storage = getStoredChats();
  const existingChat = storage.chats[chatId];
  
  storage.chats[chatId] = {
    id: chatId,
    title: title || existingChat?.title || "New Chat",
    messages,
    createdAt: existingChat?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  saveChatsToStorage(storage);
}

export function deleteStoredChat(chatId: string): void {
  const storage = getStoredChats();
  delete storage.chats[chatId];
  saveChatsToStorage(storage);
}

export function getAllChats(): StoredChat[] {
  const storage = getStoredChats();
  return Object.values(storage.chats).sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

export function clearAllChats(): void {
  if (!isBrowser) return;
  sessionStorage.removeItem(CHATS_STORAGE_KEY);
}
