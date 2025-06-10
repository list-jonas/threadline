'use client';

import { useEffect, useRef, useState } from 'react';
import { useChatStore } from '@/store/chat-store';
import { ChatMessage } from './chat-message';
import { ChatInput } from './chat-input';
import { streamChatCompletion } from '@/lib/openrouter';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';

interface ChatInterfaceProps {
  chatId?: string;
}

export function ChatInterface({ chatId }: ChatInterfaceProps) {
  const {
    getCurrentChat,
    addMessage,
    updateMessage,
    selectedModel,
    isStreaming,
    streamingMessageId,
    setStreaming,
    createNewChat,
    selectChat,
    chats,
    currentChatId,
  } = useChatStore();
  
  const [abortController, setAbortController] = useState<AbortController | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  // Select the chat if chatId is provided and different from current
  useEffect(() => {
    if (chatId && chatId !== currentChatId) {
      const chatExists = chats.find(chat => chat.id === chatId);
      if (chatExists) {
        selectChat(chatId);
      }
    }
  }, [chatId, currentChatId, chats, selectChat]);
  
  const currentChat = getCurrentChat();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [currentChat?.messages, streamingMessageId]);

  const handleSendMessage = async (content: string) => {
    let activeChatId = chatId;
    
    // Create new chat if none exists
    if (!activeChatId || !currentChat) {
      activeChatId = createNewChat();
      selectChat(activeChatId);
    }

    // Add user message
    addMessage(activeChatId, {
      role: 'user',
      content,
    });

    // Prepare messages for API
    const updatedChat = getCurrentChat();
    if (!updatedChat) return;

    const messages = updatedChat.messages.map(msg => ({
      role: msg.role,
      content: msg.content,
    }));

    // Add user message to the messages array
    messages.push({ role: 'user', content });

    // Create assistant message placeholder
    const assistantMessageId = addMessage(activeChatId, {
      role: 'assistant',
      content: '',
    });

    // Start streaming
    const controller = new AbortController();
    setAbortController(controller);
    setStreaming(true, assistantMessageId);

    try {
      let fullResponse = '';
      
      for await (const chunk of streamChatCompletion(
        messages,
        selectedModel.id,
        controller.signal
      )) {
        fullResponse += chunk;
        updateMessage(activeChatId, assistantMessageId, fullResponse);
      }
    } catch (error) {
      console.error('Error streaming chat:', error);
      if (error instanceof Error && error.message !== 'Request was cancelled') {
        updateMessage(
          activeChatId,
          assistantMessageId,
          'Sorry, I encountered an error while processing your request. Please try again.'
        );
      }
    } finally {
      setStreaming(false);
      setAbortController(null);
    }
  };

  const handleStopGeneration = () => {
    if (abortController) {
      abortController.abort();
      setAbortController(null);
      setStreaming(false);
    }
  };

  if (!currentChat) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground" />
            <div>
              <h3 className="text-lg font-medium">No chat selected</h3>
              <p className="text-sm text-muted-foreground">
                Start a new conversation by typing a message below
              </p>
            </div>
          </div>
        </div>
        <ChatInput
          onSendMessage={handleSendMessage}
          onStopGeneration={handleStopGeneration}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1" ref={scrollAreaRef}>
        <div className="space-y-1">
          {currentChat.messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              isStreaming={isStreaming && streamingMessageId === message.id}
            />
          ))}
        </div>
      </ScrollArea>
      
      <ChatInput
        onSendMessage={handleSendMessage}
        onStopGeneration={handleStopGeneration}
        disabled={isStreaming}
      />
    </div>
  );
}