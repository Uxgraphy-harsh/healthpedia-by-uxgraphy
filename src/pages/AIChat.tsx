import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Mic, Sparkles } from "lucide-react";

interface Message {
  id: number;
  role: "user" | "ai";
  text: string;
}

const suggestedPrompts = [
  "Explain my last blood report",
  "Can I eat mango with high sugar?",
  "Why is my heart rate higher today?",
  "What should I eat tonight?",
];

const initialMessages: Message[] = [
  {
    id: 1,
    role: "ai",
    text: "Hello! I'm your Healthpedia AI assistant. I have access to your health records, symptoms, and vitals. How can I help you today?",
  },
];

export default function AIChat() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now(), role: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // Simulate AI response
    setTimeout(() => {
      const responses: Record<string, string> = {
        "Explain my last blood report":
          "Based on your last blood report (March 2, 2026), your HbA1c is 6.8% which is slightly above the normal range. Your fasting glucose at 118 mg/dL suggests pre-diabetic levels. I'd recommend discussing dietary adjustments with your doctor. Your cholesterol levels are within normal range.",
        "Can I eat mango with high sugar?":
          "Given your recent fasting glucose of 118 mg/dL, I'd suggest moderation. A small portion (½ cup) of mango can fit into your diet, but pair it with protein or healthy fats to slow sugar absorption. Monitor your glucose levels after eating.",
        "Why is my heart rate higher today?":
          "Your resting heart rate today is 78 bpm, up from your average of 72 bpm. Looking at your data: you slept only 5.8 hours last night (below your 7h average), and you logged caffeine intake this morning. Both can elevate heart rate. Try to rest well tonight.",
        "What should I eat tonight?":
          "Based on your health profile and today's activity (8,432 steps, 1,847 cal burned), I'd suggest a balanced dinner: grilled fish or chicken with roasted vegetables and quinoa. This gives you protein and complex carbs while keeping glucose levels stable. Avoid heavy carbs given your recent glucose readings.",
      };
      const aiResponse = responses[text] || "I can see from your health records that you've been maintaining a generally stable health profile. Could you be more specific about what you'd like to know? I can help with reports, medications, symptoms, or dietary guidance.";
      setMessages((prev) => [...prev, { id: Date.now() + 1, role: "ai", text: aiResponse }]);
    }, 1200);
  };

  return (
    <div className="mobile-container flex flex-col h-screen">
      {/* Header */}
      <div className="px-5 pt-6 pb-4 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl gradient-primary flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-base font-bold font-serif">Healthpedia AI</h1>
            <p className="text-xs text-muted-foreground">Context-aware health assistant</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "gradient-primary text-primary-foreground rounded-br-md"
                    : "glass-card rounded-bl-md"
                }`}
              >
                {msg.text}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Suggested Prompts */}
      {messages.length <= 1 && (
        <div className="px-5 pb-3">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {suggestedPrompts.map((p) => (
              <button
                key={p}
                onClick={() => sendMessage(p)}
                className="shrink-0 glass-card px-4 py-2 text-xs font-medium text-primary"
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="px-5 pb-24 pt-2 border-t border-border/50">
        <div className="flex items-center gap-2 glass-card p-2 pr-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
            placeholder="Ask about your health..."
            className="flex-1 bg-transparent text-sm px-3 py-2 outline-none"
          />
          <button className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center">
            <Mic className="w-4 h-4 text-muted-foreground" />
          </button>
          <button
            onClick={() => sendMessage(input)}
            className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center"
          >
            <Send className="w-4 h-4 text-primary-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
}
