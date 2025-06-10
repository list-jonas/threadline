# Chat Functionality Setup

## Overview
This project now includes a complete chat interface with OpenRouter integration, featuring:

- ✅ Real-time streaming responses
- ✅ Multiple AI model selection (GPT-4o, Claude 3.5 Sonnet, Gemini Pro, etc.)
- ✅ Persistent chat history with Zustand
- ✅ New chat creation from sidebar
- ✅ Chat management (create, select, delete)
- ✅ State persistence on page refresh
- ✅ Responsive design with modern UI

## Setup Instructions

### 1. Get OpenRouter API Key
1. Visit [OpenRouter](https://openrouter.ai/)
2. Sign up or log in to your account
3. Navigate to the API Keys section
4. Create a new API key

### 2. Configure Environment Variables
1. Copy the `.env.example` file to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Add your OpenRouter API key to `.env.local`:
   ```
   OPENROUTER_API_KEY=your_api_key_here
   ```

   **Important**: Use `OPENROUTER_API_KEY` (without `NEXT_PUBLIC_` prefix) as this is a server-side only variable for security.

### 3. Available Models
The chat interface supports these models:
- **OpenAI**: GPT-4o, GPT-4o Mini
- **Anthropic**: Claude 3.5 Sonnet
- **Google**: Gemini Pro 1.5
- **Meta**: Llama 3.1 8B Instruct

### 4. Features

#### Chat Management
- **New Chat**: Click the "+" button in the sidebar
- **Select Chat**: Click on any chat in the sidebar
- **Delete Chat**: Hover over a chat and click the trash icon
- **Auto-naming**: Chats are automatically named based on the first message

#### Streaming
- Responses stream in real-time
- Stop generation with the square button
- State persists on page refresh

#### Model Selection
- Choose your preferred AI model from the dropdown
- Selection persists across sessions
- Different models have different capabilities and costs

### 5. Usage
1. Start the development server: `npm run dev`
2. Navigate to `/chat`
3. Select a model from the dropdown
4. Start chatting!

### 6. Architecture

#### State Management
- **Zustand Store** (`/src/store/chat-store.ts`): Manages chat state, messages, and persistence
- **Local Storage**: Automatically persists chats and settings

#### Components
- **ChatInterface** (`/src/components/chat/chat-interface.tsx`): Main chat container
- **ChatMessage** (`/src/components/chat/chat-message.tsx`): Individual message display
- **ChatInput** (`/src/components/chat/chat-input.tsx`): Message input with model selection
- **AppSidebar** (`/src/components/sidebar/app-sidebar.tsx`): Enhanced sidebar with chat management

#### API Integration
- **Server-Side API Route**: `/api/chat` handles OpenRouter requests securely
- **Client-Side Service**: `openrouter.ts` communicates with the API route
- **Streaming Support**: Server-Sent Events for real-time message streaming
- **Security**: API key is kept server-side only
- **Error Handling**: Comprehensive error handling and user feedback

### 7. Routes
- `/chat` - Main chat interface (no specific chat selected)
- `/chat/[chatId]` - Specific chat conversation

### 8. Security Notes
- API keys are stored as server-side environment variables only
- All OpenRouter requests are made from the server-side API route
- No API keys are exposed to the client-side code
- Streaming is handled securely through Server-Sent Events
- No sensitive data is logged or exposed

## Troubleshooting

### Common Issues
1. **No API Key**: Make sure `NEXT_PUBLIC_OPENROUTER_API_KEY` is set in `.env.local`
2. **Streaming Issues**: Check browser console for network errors
3. **State Not Persisting**: Clear browser storage and try again
4. **Model Not Working**: Verify the model ID is correct in the store

### Development
- All components are designed to be reusable
- State management is centralized in Zustand
- TypeScript types are defined for all interfaces
- Components follow modern React patterns with hooks