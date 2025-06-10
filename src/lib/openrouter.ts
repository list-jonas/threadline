// Client-side OpenRouter service that communicates with our API route

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export async function* streamChatCompletion(
  messages: ChatMessage[],
  model: string,
  signal?: AbortSignal
) {
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages, model }),
      signal,
    });

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ error: "Unknown error" }));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error("No response body");
    }

    const decoder = new TextDecoder();
    let buffer = "";

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") {
              return;
            }
            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                yield parsed.content;
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Request was cancelled");
    }
    throw error;
  }
}

export async function getChatCompletion(
  messages: ChatMessage[],
  model: string
): Promise<string> {
  try {
    let fullResponse = "";
    for await (const chunk of streamChatCompletion(messages, model)) {
      fullResponse += chunk;
    }
    return fullResponse;
  } catch (error) {
    throw error;
  }
}
