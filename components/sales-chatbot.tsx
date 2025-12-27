"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageCircle, X, Send, Loader2, Minimize2 } from "lucide-react"
import { useChatbot } from "./chatbot-provider"

export default function SalesChatbot() {
  const { isOpen, messages, isTyping, openChat, closeChat, toggleChat, sendMessage } = useChatbot();
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSend = async () => {
    if (!inputValue.trim() || isTyping) return;

    const messageToSend = inputValue;
    setInputValue("");
    await sendMessage(messageToSend);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Quick prompts for users
  const quickPrompts = [
    "Tell me about Tory",
    "What services do you offer?",
    "How much does it cost?",
    "What's the Clarity Call?"
  ];

  const handleQuickPrompt = (prompt: string) => {
    sendMessage(prompt);
  };

  return (
    <>
      {/* Floating Chat Button - Bottom Right */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            onClick={openChat}
            className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-[#ff6a1a] text-white rounded-full shadow-2xl hover:bg-[#ff8a3a] transition-all hover:scale-110 flex items-center justify-center group"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
            aria-label="Open chat"
          >
            <MessageCircle className="w-7 h-7" />

            {/* Pulse animation */}
            <span className="absolute inset-0 rounded-full bg-[#ff6a1a] animate-ping opacity-20" />

            {/* Tooltip */}
            <span className="absolute bottom-full right-0 mb-2 px-3 py-1.5 bg-black text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
              Chat with Tory's Team
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Mobile: Full screen overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 md:hidden"
              onClick={closeChat}
            />

            {/* Chat Container */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed bottom-6 right-6 z-50 w-full max-w-md md:w-96 h-[600px] md:h-[650px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden md:max-h-[calc(100vh-3rem)] inset-x-4 md:inset-x-auto"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-[#ff6a1a] to-[#ff8a3a] text-white p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Chat with Tory's Team</h3>
                    <p className="text-xs text-white/80">We typically reply instantly</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={closeChat}
                    className="w-8 h-8 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
                    aria-label="Minimize chat"
                  >
                    <Minimize2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={closeChat}
                    className="w-8 h-8 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors md:hidden"
                    aria-label="Close chat"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                        message.role === "user"
                          ? "bg-[#ff6a1a] text-white rounded-br-none"
                          : "bg-white text-gray-800 shadow-sm rounded-bl-none border border-gray-100"
                      }`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {message.content}
                      </p>
                      <p
                        className={`text-xs mt-1.5 ${
                          message.role === "user" ? "text-white/70" : "text-gray-400"
                        }`}
                      >
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </p>
                    </div>
                  </motion.div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="bg-white text-gray-800 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm border border-gray-100">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Quick Prompts - Show after welcome message */}
                {messages.length === 1 && !isTyping && (
                  <div className="space-y-2">
                    <p className="text-xs text-gray-500 text-center">Quick questions:</p>
                    <div className="flex flex-wrap gap-2">
                      {quickPrompts.map((prompt, index) => (
                        <motion.button
                          key={index}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          onClick={() => handleQuickPrompt(prompt)}
                          className="text-xs px-3 py-2 bg-white border border-[#ff6a1a]/30 text-[#ff6a1a] rounded-full hover:bg-[#ff6a1a]/10 transition-colors"
                        >
                          {prompt}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="border-t border-gray-200 p-4 bg-white">
                <div className="flex items-end gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    disabled={isTyping}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff6a1a] focus:border-transparent resize-none disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  />
                  <button
                    onClick={handleSend}
                    disabled={!inputValue.trim() || isTyping}
                    className="w-12 h-12 bg-[#ff6a1a] text-white rounded-xl hover:bg-[#ff8a3a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center flex-shrink-0"
                    aria-label="Send message"
                  >
                    {isTyping ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Powered by A Startup Biz
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
