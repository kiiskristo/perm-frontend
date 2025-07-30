"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, X, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { chatbotService, type ChatbotResponse } from '../services/chatbotService';
import { executeRecaptcha } from '@/utils/recaptcha';
import { trackChatbotOpen, trackChatbotClose, trackChatbotMessage } from '@/utils/analytics';

interface ChatMessage {
  id: string;
  content: string;
  type: 'user' | 'bot';
  timestamp: Date;
  isTyping?: boolean;
  links?: ChatbotResponse['links'];
  responseType?: string;
}

interface ChatbotProps {
  className?: string;
}

const STORAGE_KEY = 'perm-chatbot-messages';
const OPEN_STATE_KEY = 'perm-chatbot-open';

export default function Chatbot({ className = '' }: ChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Load chat history and open state from sessionStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedMessages = sessionStorage.getItem(STORAGE_KEY);
        const savedOpenState = sessionStorage.getItem(OPEN_STATE_KEY);
        
        if (savedMessages) {
          const parsedMessages = JSON.parse(savedMessages).map((msg: Omit<ChatMessage, 'timestamp'> & { timestamp: string }) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }));
          setMessages(parsedMessages);
        } else {
          // Set default welcome message if no saved messages
          setMessages([{
            id: '1',
            content: "Hi! I'm your PERM assistant. I can help you with questions about PERM cases, processing times, and status updates. To see what I can answer, type \"help\".",
            type: 'bot',
            timestamp: new Date(),
          }]);
        }
        
        if (savedOpenState === 'true') {
          setIsOpen(true);
        }
      } catch (error) {
        console.error('Error loading chat history:', error);
        // Fallback to default welcome message
        setMessages([{
          id: '1',
          content: "Hi! I'm your PERM assistant. I can help you with questions about PERM cases, processing times, and status updates. To see what I can answer, type \"help\".",
          type: 'bot',
          timestamp: new Date(),
        }]);
      }
    }
  }, []);

  // Save messages to sessionStorage whenever messages change
  useEffect(() => {
    if (typeof window !== 'undefined' && messages.length > 0) {
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
      } catch (error) {
        console.error('Error saving chat history:', error);
      }
    }
  }, [messages]);

  // Save open state to sessionStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(OPEN_STATE_KEY, isOpen.toString());
    }
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      type: 'user',
      timestamp: new Date(),
    };

    const typingMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      content: '',
      type: 'bot',
      timestamp: new Date(),
      isTyping: true,
    };

    setMessages(prev => [...prev, userMessage, typingMessage]);
    setInputValue('');
    setIsLoading(true);
    setError('');

    // Track user message
    trackChatbotMessage();

    try {
      // Get reCAPTCHA token
      const recaptchaKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '';
      const token = await executeRecaptcha(recaptchaKey, 'chatbot');
      
      if (!token) {
        throw new Error("Failed to verify you're human. Please try again.");
      }

      // Send message to chatbot API
      const response = await chatbotService.sendMessage(userMessage.content, token);
      
      // Remove typing indicator and add actual response
      setMessages(prev => {
        const messagesWithoutTyping = prev.filter(msg => !msg.isTyping);
        const botResponse: ChatMessage = {
          id: (Date.now() + 2).toString(),
          content: response.response,
          type: 'bot',
          timestamp: new Date(),
          links: response.links,
          responseType: response.type,
        };
        return [...messagesWithoutTyping, botResponse];
      });

    } catch (err) {
      // Remove typing indicator and show error
      setMessages(prev => prev.filter(msg => !msg.isTyping));
      
      let errorMessage = 'Sorry, I encountered an error. Please try again.';
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      
      // Add error message to chat
      const errorBotMessage: ChatMessage = {
        id: (Date.now() + 3).toString(),
        content: `Sorry, ${errorMessage}`,
        type: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorBotMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
      {/* Chat Toggle Button */}
      {!isOpen && (
        <div className="relative">
                      <button
              onClick={() => {
                setIsOpen(true);
                trackChatbotOpen();
              }}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-full w-14 h-14 shadow-lg transition-all duration-300 hover:scale-110 flex items-center justify-center border-0"
            >
              <Bot className="h-6 w-6 text-white stroke-2" />
            </button>
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 w-96 h-[500px] flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="bg-white/20 rounded-full p-1">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold">PERM Assistant</h3>
                <p className="text-xs text-purple-100">Ask me about PERM cases</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                trackChatbotClose();
                setIsOpen(false);
              }}
              className="text-white hover:bg-white/20 h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            {error && (
              <p className="text-sm text-red-600 dark:text-red-400 mb-2">{error}</p>
            )}
            <div className="flex space-x-2">
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask about PERM cases..."
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md resize-none h-10 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                rows={1}
                disabled={isLoading}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-3"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ChatMessage({ message }: { message: ChatMessage }) {
  const isBot = message.type === 'bot';
  
  // Function to convert **text** to <strong>text</strong>
  const formatBoldText = (text: string): string => {
    return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  };
  
  return (
    <div className={`flex ${isBot ? 'justify-start' : 'justify-end'}`}>
      <div className={`flex max-w-[80%] ${isBot ? 'flex-row' : 'flex-row-reverse'} items-start space-x-2`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isBot 
            ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white' 
            : 'bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
        }`}>
          {isBot ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
        </div>
        
        {/* Message Bubble */}
        <div className={`rounded-lg px-3 py-2 ${
          isBot 
            ? 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100' 
            : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
        }`}>
          {message.isTyping ? (
            <div className="flex items-center space-x-1">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
              <span className="text-xs text-gray-500 ml-2">typing...</span>
            </div>
                     ) : (
             <>
               <div 
                 className="text-sm whitespace-pre-wrap"
                 dangerouslySetInnerHTML={{ __html: formatBoldText(message.content) }}
               />
               
               {/* Render links if present */}
               {message.links && message.links.length > 0 && (
                 <div className="mt-3 space-y-2">
                   {message.links.map((link, index) => (
                     <Link
                       key={index}
                       href={link.url}
                       className={`inline-flex items-center gap-2 px-3 py-2 rounded-md transition-colors text-sm ${
                         isBot 
                           ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 border border-blue-200 dark:border-blue-800' 
                           : 'bg-white/20 text-white hover:bg-white/30 border border-white/30'
                       }`}
                     >
                       <span className="font-medium">{link.text}</span>
                       <ExternalLink className="h-3 w-3" />
                     </Link>
                   ))}
                   {message.links.length === 1 && message.links[0].description && (
                     <p className={`text-xs ${
                       isBot ? 'text-gray-500 dark:text-gray-400' : 'text-purple-100 opacity-80'
                     }`}>
                       {message.links[0].description}
                     </p>
                   )}
                 </div>
               )}
             </>
           )}
           
           {!message.isTyping && (
             <div className={`text-xs mt-2 opacity-70 ${
               isBot ? 'text-gray-500 dark:text-gray-400' : 'text-purple-100'
             }`}>
               {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
             </div>
           )}
        </div>
      </div>
    </div>
  );
} 