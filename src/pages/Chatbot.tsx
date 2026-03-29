import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getChatbotResponse } from '@/lib/fitness-utils';
import Footer from '@/components/Footer';

interface Message {
  role: 'user' | 'bot';
  content: string;
}

const quickPrompts = [
  'How do I use this platform?',
  'What is BMI?',
  'How to lose weight?',
  'Tell me about calories',
  'Exercise recommendations',
  'Diet tips',
];

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', content: "Hey there! 👋 I'm your **FitPulse AI assistant**. Ask me anything about fitness, BMI, calories, diet, exercises, or how to use this platform!" },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const send = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { role: 'user', content: text.trim() };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setTyping(true);

    setTimeout(() => {
      const response = getChatbotResponse(text);
      setMessages((m) => [...m, { role: 'bot', content: response }]);
      setTyping(false);
    }, 600 + Math.random() * 600);
  };

  return (
    <div className="min-h-screen pt-20 flex flex-col">
      <div className="container mx-auto px-4 py-8 flex-1 flex flex-col max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold mb-2">
            AI <span className="gradient-text">Fitness Assistant</span>
          </h1>
          <p className="text-muted-foreground mb-6">Ask anything about fitness, health, or how to use FitPulse.</p>
        </motion.div>

        {/* Quick prompts */}
        <div className="flex flex-wrap gap-2 mb-4">
          {quickPrompts.map((p) => (
            <button key={p} onClick={() => send(p)}
              className="text-xs px-3 py-1.5 rounded-full bg-secondary border border-border text-muted-foreground hover:text-primary hover:border-primary/30 transition-all">
              {p}
            </button>
          ))}
        </div>

        {/* Chat area */}
        <div className="glass-card rounded-2xl flex-1 flex flex-col min-h-[400px] max-h-[60vh] overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                {msg.role === 'bot' && (
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'var(--gradient-primary)' }}>
                    <Bot className="w-4 h-4 text-primary-foreground" />
                  </div>
                )}
                <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-primary/20 text-foreground rounded-br-md'
                    : 'bg-secondary/50 text-foreground rounded-bl-md'
                }`}>
                  {msg.content.split('\n').map((line, j) => (
                    <span key={j}>
                      {line.split(/(\*\*.*?\*\*)/g).map((part, k) =>
                        part.startsWith('**') && part.endsWith('**')
                          ? <strong key={k}>{part.slice(2, -2)}</strong>
                          : part
                      )}
                      {j < msg.content.split('\n').length - 1 && <br />}
                    </span>
                  ))}
                </div>
                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                    <User className="w-4 h-4 text-muted-foreground" />
                  </div>
                )}
              </motion.div>
            ))}
            {typing && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'var(--gradient-primary)' }}>
                  <Sparkles className="w-4 h-4 text-primary-foreground animate-pulse" />
                </div>
                <div className="bg-secondary/50 rounded-2xl rounded-bl-md px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border/50">
            <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything about fitness..."
                className="flex-1 bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <Button type="submit" disabled={!input.trim() || typing} className="rounded-xl px-4" style={{ background: 'var(--gradient-primary)' }}>
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
