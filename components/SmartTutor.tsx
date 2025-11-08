import React, { useState, useRef, useEffect } from 'react';
import { createChat } from '../services/geminiService';
import { ChatMessage } from '../types';
import LoadingSpinner from './icons/LoadingSpinner';
import type { Chat } from "@google/genai";

const SmartTutor: React.FC = () => {
  const [chat, setChat] = useState<Chat | null>(null);
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    try {
      setChat(createChat());
      setHistory([{
          role: 'model',
          text: "Hello! I'm Ace, your AI tutor. Paste some text from your studies or ask me a question to get started!"
      }]);
    } catch(err: any) {
        setError(err.message);
    }
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [history]);

  const handleSendMessage = async () => {
    if (!userInput.trim() || isLoading || !chat) return;

    const newUserMessage: ChatMessage = { role: 'user', text: userInput };
    setHistory(prev => [...prev, newUserMessage]);
    setUserInput('');
    setIsLoading(true);
    setError('');

    try {
      const response = await chat.sendMessage({ message: userInput });
      const modelMessage: ChatMessage = { role: 'model', text: response.text };
      setHistory(prev => [...prev, modelMessage]);
    } catch (err: any) {
      setError('Sorry, something went wrong. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <section id="tutor" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Your Personal AI Tutor</h2>
          <p className="text-lg text-gray-600 mt-2">Stuck on a concept? Chat with Ace to get clear, interactive explanations.</p>
        </div>

        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col h-[600px]">
          <div ref={chatContainerRef} className="flex-1 p-6 overflow-y-auto space-y-6">
            {history.map((msg, index) => (
              <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                {msg.role === 'model' && (
                  <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold flex-shrink-0">A</div>
                )}
                <div className={`px-4 py-3 rounded-2xl max-w-sm ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-gray-100 text-gray-800 rounded-bl-none'}`}>
                  <p className="text-sm" style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold flex-shrink-0">A</div>
                 <div className="px-4 py-3 rounded-2xl max-w-sm bg-gray-100 text-gray-800 rounded-bl-none">
                    <LoadingSpinner />
                 </div>
              </div>
            )}
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          </div>
          <div className="p-4 border-t border-gray-200 bg-white rounded-b-2xl">
            <div className="relative">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask a question about your notes..."
                className="w-full py-3 pl-4 pr-12 border border-gray-300 rounded-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading || !userInput.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-indigo-600 text-white w-9 h-9 rounded-full flex items-center justify-center hover:bg-indigo-700 disabled:bg-indigo-300 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SmartTutor;
