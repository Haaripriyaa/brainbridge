import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Button from "@/components/Button";
import { Send, ArrowLeft, Paperclip, Image, Mic, MessageSquare } from "lucide-react";
import { generateUniqueId } from "@/lib/utils";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { getChatResponse } from "@/lib/chatbotService";

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
}

const ChatBot = () => {
  const navigate = useNavigate();
  // Start with empty messages to remove first prompt
  const initialMessages: Message[] = [];
  
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    // Add user message
    const newUserMessage: Message = {
      id: generateUniqueId(),
      sender: "user",
      text: inputMessage,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInputMessage("");
    setIsTyping(true);

    try {
      // Get response from Gemini API
      const aiResponse = await getChatResponse(inputMessage);
      
      const newAiMessage: Message = {
        id: generateUniqueId(),
        sender: "bot",
        text: aiResponse,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, newAiMessage]);
    } catch (error) {
      console.error("Failed to get chat response:", error);
      toast.error("Failed to get response from AI. Please try again later.");
      
      const errorMessage: Message = {
        id: generateUniqueId(),
        sender: "bot",
        text: "Sorry, I'm having trouble connecting to the AI service right now. Please try again later.",
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const userProfile = {
    name: "Haripriya",
    email: "haripriya@example.com",
    course: localStorage.getItem("selectedCourse")?.toUpperCase() || "NEET"
  };

  return (
    <div className="min-h-screen bg-purple-50">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-10 flex items-center p-4 border-b bg-brainbridge-purple text-white">
        <Button 
          variant="icon" 
          className="text-white hover:bg-purple-600 mr-2 border-none" 
          leftIcon={<ArrowLeft size={18} />}
          onClick={() => navigate("/dashboard")}
          aria-label="Back to Dashboard"
        />
        <div>
          <h1 className="font-semibold">Study Assistant</h1>
          <p className="text-xs text-purple-100">AI powered {userProfile?.course || "NEET"} tutor</p>
        </div>
      </div>
      
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 bg-white pt-16 pb-20 min-h-screen">
        <div className="space-y-4 max-w-3xl mx-auto">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-[70vh] text-center">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <MessageSquare size={30} className="text-brainbridge-purple" />
              </div>
              <h3 className="text-xl font-medium text-gray-800 mb-2">Welcome to your AI Study Assistant</h3>
              <p className="text-gray-600 max-w-md">
                Ask me anything about your {userProfile?.course || "NEET"} preparation, and I'll help you understand complex topics.
              </p>
            </div>
          )}
          
          {messages.map(message => (
            <motion.div 
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[75%] rounded-lg p-3 ${
                  message.sender === 'user' 
                    ? 'bg-brainbridge-purple text-white rounded-tr-none'
                    : 'bg-gray-100 text-gray-800 rounded-tl-none'
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <p className="text-xs mt-1 opacity-70 text-right">
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </motion.div>
          ))}
          
          {isTyping && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="bg-gray-100 text-gray-800 rounded-lg rounded-tl-none p-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0s" }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                </div>
              </div>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* Input Area */}
      <div className="fixed bottom-0 left-0 right-0 p-4 border-t bg-white">
        <div className="max-w-3xl mx-auto flex items-center bg-gray-100 rounded-full px-4 py-2">
          <button 
            className="p-2 text-gray-500 hover:text-gray-700 mr-1"
            onClick={() => toast.info("Attachment feature coming soon!")}
          >
            <Paperclip size={18} />
          </button>
          <button 
            className="p-2 text-gray-500 hover:text-gray-700 mr-1"
            onClick={() => toast.info("Image upload feature coming soon!")}
          >
            <Image size={18} />
          </button>
          <input
            ref={inputRef}
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about your studies..."
            className="flex-1 bg-transparent text-gray-800 outline-none text-sm px-2"
            disabled={isTyping}
          />
          <button 
            className="p-2 text-gray-500 hover:text-gray-700 mr-1"
            onClick={() => toast.info("Voice input feature coming soon!")}
          >
            <Mic size={18} />
          </button>
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isTyping}
            className={`p-2 rounded-full ${
              inputMessage.trim() && !isTyping
                ? 'bg-brainbridge-purple text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
