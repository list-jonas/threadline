import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Model {
  id: string;
  name: string;
  provider: string;
}

interface ChatState {
  chats: Chat[];
  currentChatId: string | null;
  selectedModel: Model;
  isStreaming: boolean;
  streamingMessageId: string | null;

  // Actions
  createNewChat: () => string;
  selectChat: (chatId: string) => void;
  addMessage: (
    chatId: string,
    message: Omit<Message, "id" | "timestamp">
  ) => string;
  updateMessage: (chatId: string, messageId: string, content: string) => void;
  deleteChat: (chatId: string) => void;
  setSelectedModel: (model: Model) => void;
  setStreaming: (isStreaming: boolean, messageId?: string) => void;
  getCurrentChat: () => Chat | null;
}

const defaultModels: Model[] = [
  { id: "openai/gpt-4o", name: "GPT-4o", provider: "OpenAI" },
  { id: "openai/gpt-4o-mini", name: "GPT-4o Mini", provider: "OpenAI" },
  {
    id: "anthropic/claude-3.5-sonnet",
    name: "Claude 3.5 Sonnet",
    provider: "Anthropic",
  },
  { id: "google/gemini-pro-1.5", name: "Gemini Pro 1.5", provider: "Google" },
  {
    id: "meta-llama/llama-3.1-8b-instruct",
    name: "Llama 3.1 8B",
    provider: "Meta",
  },
];

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      chats: [],
      currentChatId: null,
      selectedModel: defaultModels[0],
      isStreaming: false,
      streamingMessageId: null,

      createNewChat: () => {
        const newChatId = `chat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const newChat: Chat = {
          id: newChatId,
          title: "New Chat",
          messages: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        set((state) => ({
          chats: [newChat, ...state.chats],
          currentChatId: newChatId,
        }));

        return newChatId;
      },

      selectChat: (chatId: string) => {
        set({ currentChatId: chatId });
      },

      addMessage: (chatId, message) => {
        const newChat = get().chats.find((chat) => chat.id === chatId);
        if (!newChat) {
          console.error(`Chat with ID ${chatId} not found.`);
          return "";
        }

        const newMessageId = uuidv4();
        const newMessage: Message = {
          id: newMessageId,
          role: message.role,
          content: message.content,
          timestamp: message.timestamp || new Date(),
        };

        newChat.messages.push(newMessage);

        // Update title if it's the first user message
        if (newChat.messages.length === 1 && message.role === "user") {
          newChat.title =
            message.content.slice(0, 50) +
            (message.content.length > 50 ? "..." : "");
        }

        set({ chats: [...get().chats] });
        return newMessageId;
      },

      updateMessage: (chatId: string, messageId: string, content: string) => {
        set((state) => ({
          chats: state.chats.map((chat) => {
            if (chat.id === chatId) {
              return {
                ...chat,
                messages: chat.messages.map((msg) =>
                  msg.id === messageId ? { ...msg, content } : msg
                ),
                updatedAt: new Date(),
              };
            }
            return chat;
          }),
        }));
      },

      deleteChat: (chatId: string) => {
        set((state) => {
          const newChats = state.chats.filter((chat) => chat.id !== chatId);
          const newCurrentChatId =
            state.currentChatId === chatId
              ? newChats.length > 0
                ? newChats[0].id
                : null
              : state.currentChatId;

          return {
            chats: newChats,
            currentChatId: newCurrentChatId,
          };
        });
      },

      setSelectedModel: (model: Model) => {
        set({ selectedModel: model });
      },

      setStreaming: (isStreaming: boolean, messageId?: string) => {
        set({
          isStreaming,
          streamingMessageId: isStreaming ? messageId || null : null,
        });
      },

      getCurrentChat: () => {
        const state = get();
        return (
          state.chats.find((chat) => chat.id === state.currentChatId) || null
        );
      },
    }),
    {
      name: "chat-store",
      version: 1,
      partialize: (state) => ({
        chats: state.chats,
        currentChatId: state.currentChatId,
        selectedModel: state.selectedModel,
      }),
      deserialize: (state) => {
        const newState = JSON.parse(state);
        newState.state.chats.forEach((chat: Chat) => {
          chat.createdAt = new Date(chat.createdAt);
          chat.updatedAt = new Date(chat.updatedAt);
          chat.messages.forEach((message: Message) => {
            message.timestamp = new Date(message.timestamp);
          });
        });
        return newState;
      },
    }
  )
);

export { defaultModels };
