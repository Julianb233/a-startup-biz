"use client"

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react"
import { usePathname } from "next/navigation"

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface PageContext {
  path: string;
  pageTitle: string;
}

interface ChatbotContextType {
  isOpen: boolean;
  messages: ChatMessage[];
  isTyping: boolean;
  pageContext: PageContext;
  openChat: () => void;
  closeChat: () => void;
  toggleChat: () => void;
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
}

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined);

// Context-aware welcome messages
const getWelcomeMessage = (path: string): string => {
  if (path.includes('/services')) {
    return "Welcome! I see you're checking out our services. I'm the Startup Biz Butler, here to help you find exactly what you need. We've got 17 different ways to help your business grow. What caught your eye, or would you like me to give you the overview?";
  }
  if (path.includes('/about')) {
    return "Hey there! I'm the Startup Biz Butler. I see you're learning about Tory - smart move! He's got quite a story. 46 years of building businesses, over 100 of them. Not a consultant who studied business - someone who actually lived it. What would you like to know about him?";
  }
  if (path.includes('/contact')) {
    return "Hello! I'm the Startup Biz Butler. Ready to connect with us? I can answer quick questions right here, or you can fill out the form to reach our team directly. How can I help you today?";
  }
  if (path.includes('/quote') || path.includes('/clarity')) {
    return "Hello! Thinking about booking a Clarity Call? Great choice. I'm the Startup Biz Butler, and I'd be happy to tell you exactly what you'll get from those 90 minutes with Tory. It's $1,000 and worth every penny. Want the details?";
  }
  if (path.includes('/get-approved') || path.includes('/partner')) {
    return "Welcome! Looking to become a partner? I'm the Startup Biz Butler. Our partner program lets you earn commissions by referring clients to our services. It's a great way to add value while helping businesses succeed. What would you like to know?";
  }
  // Default welcome
  return "Hello! I'm the Startup Biz Butler, at your service. I'm here to help you learn about Tory Zweigle's consulting services and find exactly what your business needs.\n\nTory has 46+ years of real-world experience building over 100 businesses. He's not a traditional consultant - he's actually lived it.\n\nHow can I help you today?";
};

// Get page title from path
const getPageTitle = (path: string): string => {
  if (path.includes('/services')) return 'Services';
  if (path.includes('/about')) return 'About Tory';
  if (path.includes('/contact')) return 'Contact';
  if (path.includes('/quote') || path.includes('/clarity')) return 'Clarity Call';
  if (path.includes('/get-approved')) return 'Partner Application';
  if (path.includes('/partner')) return 'Partner Portal';
  if (path.includes('/dashboard')) return 'Dashboard';
  if (path.includes('/links')) return 'Links';
  return 'Home';
};

export function ChatbotProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [pageContext, setPageContext] = useState<PageContext>({ path: '/', pageTitle: 'Home' });
  const [isTyping, setIsTyping] = useState(false);

  // Track page changes
  useEffect(() => {
    setPageContext({
      path: pathname,
      pageTitle: getPageTitle(pathname)
    });
  }, [pathname]);

  // Initialize welcome message only on client to avoid hydration mismatch
  useEffect(() => {
    if (!isInitialized) {
      const welcomeMessage = getWelcomeMessage(pathname);
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content: welcomeMessage,
          timestamp: new Date()
        }
      ]);
      setIsInitialized(true);
    }
  }, [isInitialized, pathname]);

  const openChat = useCallback(() => setIsOpen(true), []);
  const closeChat = useCallback(() => setIsOpen(false), []);
  const toggleChat = useCallback(() => setIsOpen((prev) => !prev), []);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: content.trim(),
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    try {
      // Call AI chat API with page context
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content.trim(),
          pageContext
        })
      });

      const data = await response.json();

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: data.message || "I'm here to help! What would you like to know about our services?",
        timestamp: new Date()
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      // Fallback to local knowledge base if API fails
      const { matchIntent, generateResponse } = await import("@/lib/chatbot-knowledge");
      const intent = matchIntent(content);
      const responseContent = generateResponse(intent, content);

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: responseContent,
        timestamp: new Date()
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } finally {
      setIsTyping(false);
    }
  }, [pageContext]);

  const clearMessages = useCallback(() => {
    const welcomeMessage = getWelcomeMessage(pathname);
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: welcomeMessage,
        timestamp: new Date()
      }
    ]);
  }, [pathname]);

  return (
    <ChatbotContext.Provider
      value={{
        isOpen,
        messages,
        isTyping,
        pageContext,
        openChat,
        closeChat,
        toggleChat,
        sendMessage,
        clearMessages
      }}
    >
      {children}
    </ChatbotContext.Provider>
  );
}

export function useChatbot() {
  const context = useContext(ChatbotContext);
  if (context === undefined) {
    throw new Error("useChatbot must be used within a ChatbotProvider");
  }
  return context;
}
