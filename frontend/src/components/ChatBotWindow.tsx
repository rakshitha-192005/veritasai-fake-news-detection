import React, { useState } from 'react';
import { Send, Bot, User, Sparkles, X, Minimize2 } from 'lucide-react';
import { apiService } from '../services/api';
import { PredictionResponse } from '../types';

interface ChatBotWindowProps {
  contextPrediction?: PredictionResponse | null;
  onClose?: () => void;
}

export const ChatBotWindow: React.FC<ChatBotWindowProps> = ({ contextPrediction, onClose }) => {
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'bot'; text: string }>>([
    {
      sender: 'bot',
      text: contextPrediction
        ? `Hello! I am **VeritasGPT**, your AI Fact Assistant. I see you are inspecting article context: *"${contextPrediction.title || contextPrediction.content_snippet.slice(0, 40)}..."*. How can I help you analyze it?`
        : 'Hello! I am **VeritasGPT**, your AI Disinformation & Fact Assistant. Ask me anything about verifying claims, identifying bias, or checking news sources!'
    }
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const newMsgs = [...messages, { sender: 'user' as const, text: query }];
    setMessages(newMsgs);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const res = await apiService.queryAssistant(query, contextPrediction || undefined);
      setMessages([...newMsgs, { sender: 'bot', text: res.answer }]);
    } catch (e) {
      setMessages([
        ...newMsgs,
        { sender: 'bot', text: 'I encountered an error connecting to the AI assistant service.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const presetQuestions = [
    "Why is this flagged as fake?",
    "What evidence supports this claim?",
    "How should I verify news articles?",
    "Which news sources are trustworthy?"
  ];

  return (
    <div className="glass-card rounded-2xl border border-slate-800 flex flex-col h-[560px] shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-600/30">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
              VeritasGPT Assistant <span className="text-[10px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded font-semibold">LLM v1.0</span>
            </h3>
            <p className="text-[11px] text-slate-400">Media Literacy & Fact Verification Expert</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 p-5 overflow-y-auto space-y-4">
        {messages.map((m, idx) => (
          <div key={idx} className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            {m.sender === 'bot' && (
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white text-xs shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4" />
              </div>
            )}
            <div
              className={`p-3.5 rounded-2xl max-w-[85%] text-xs leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-none shadow-md'
                  : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none whitespace-pre-line'
              }`}
            >
              {m.text}
            </div>
            {m.sender === 'user' && (
              <div className="w-7 h-7 rounded-lg bg-purple-600 flex items-center justify-center text-white text-xs shrink-0 mt-0.5">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-xs text-slate-400 italic pl-10">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping"></span>
            VeritasGPT is analyzing reasoning...
          </div>
        )}
      </div>

      {/* Preset Suggestions */}
      <div className="px-4 py-2 bg-slate-950/60 border-t border-slate-800/60 flex items-center gap-2 overflow-x-auto">
        {presetQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium whitespace-nowrap transition"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask VeritasGPT why this news is fake or how to verify..."
          className="flex-1 px-4 py-2.5 rounded-xl glass-input text-xs text-white placeholder-slate-500"
        />
        <button
          onClick={() => handleSend()}
          disabled={loading || !input.trim()}
          className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white shadow-md transition"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
