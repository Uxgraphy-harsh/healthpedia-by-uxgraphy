import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { X as XIcon, ClockCounterClockwise, Microphone, Paperclip } from "@phosphor-icons/react";
import { Heartbeat, FileText } from "@phosphor-icons/react";
import { Send, AlertCircle, RefreshCw, Clock, MessageCircle } from "lucide-react";
import askAiFlower from "@/assets/ask-ai-flower.svg";

// ─── Types ──────────────────────────────────────────────────────────────────────

interface Attachment {
  id: string;
  name: string;
  type: "pdf" | "image" | "document";
  size?: string;
}

interface Message {
  id: number;
  role: "user" | "ai";
  text: string;
  timestamp: Date;
  attachments?: Attachment[];
  status?: "sending" | "sent" | "error";
}

interface ChatSession {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messageCount: number;
}

// ─── Sample Data ────────────────────────────────────────────────────────────────

const sampleSessions: ChatSession[] = [
  { id: "s1", title: "Blood Report Discussion", lastMessage: "Your HbA1c levels are slightly elevated...", timestamp: new Date("2026-03-10T14:30:00"), messageCount: 8 },
  { id: "s2", title: "Diet Recommendations", lastMessage: "For dinner, I'd suggest grilled chicken...", timestamp: new Date("2026-03-09T18:00:00"), messageCount: 12 },
  { id: "s3", title: "Medication Review", lastMessage: "Metformin should be taken with food...", timestamp: new Date("2026-03-08T09:00:00"), messageCount: 5 },
];

const quickChips = [
  { icon: Heartbeat, label: "Log symptoms" },
  { icon: FileText, label: "Analyze Reports" },
];

const smartResponses: Record<string, string> = {
  "Log symptoms":
    "Sure! Let me help you log your symptoms. What symptoms are you experiencing today?\n\n• **Type** — headache, fatigue, nausea, etc.\n• **Severity** — mild, moderate, or severe\n• **Duration** — when did it start?",
  "Analyze Reports":
    "I can help analyze your medical reports. Please upload a report or tell me which one you'd like me to review.\n\nI have access to:\n• Blood Report (March 2, 2026)\n• Thyroid Panel (Feb 15, 2026)\n• Lipid Profile (Jan 28, 2026)",
};

// ─── Format relative time ───────────────────────────────────────────────────────

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

// ─── Main Component ─────────────────────────────────────────────────────────────

export default function AIChat() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [messages, isTyping]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 120) + "px";
    }
  }, [input]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now(),
      role: "user",
      text: text.trim(),
      timestamp: new Date(),
      status: "sent",
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const aiResponse = smartResponses[text.trim()] ||
        "I can see from your health records that you've been maintaining a generally stable health profile. Could you be more specific about what you'd like to know? I can help with:\n\n• Blood reports & lab results\n• Medication guidance\n• Symptom analysis\n• Dietary recommendations";

      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: "ai", text: aiResponse, timestamp: new Date(), status: "sent" },
      ]);
      setIsTyping(false);
    }, 1500);
  };

  const retryMessage = (msgId: number) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === msgId ? { ...m, status: "sent" } : m))
    );
  };

  const isEmptyState = messages.length === 0;

  function renderMessageText(text: string) {
    const lines = text.split("\n");
    return lines.map((line, i) => {
      const formatted = line.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>');
      if (line.startsWith("• ")) {
        return (
          <div key={i} className="flex gap-2 items-start py-0.5">
            <span className="text-primary mt-0.5">•</span>
            <span dangerouslySetInnerHTML={{ __html: formatted.slice(2) }} />
          </div>
        );
      }
      if (line.trim() === "") return <div key={i} className="h-2" />;
      return <p key={i} dangerouslySetInnerHTML={{ __html: formatted }} />;
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background relative overflow-hidden">
      {/* Pink gradient at the bottom of the page */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[40%] pointer-events-none"
        style={{
          background: "linear-gradient(180deg, transparent 0%, rgba(255,200,220,0.25) 60%, rgba(255,180,210,0.35) 100%)",
        }}
      />
      {/* ─── HEADER ─── */}
      <div className="flex items-center justify-between px-5 pt-4 pb-3">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-full flex items-center justify-center"
        >
          <XIcon size={22} weight="bold" className="text-foreground" />
        </button>
        <button
          onClick={() => setShowHistory(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border/60 bg-card/80"
        >
          <ClockCounterClockwise size={16} className="text-muted-foreground" />
          <span className="text-xs font-medium text-muted-foreground">Chat history</span>
        </button>
      </div>

      {/* ─── CONVERSATION AREA ─── */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 flex flex-col">
        {isEmptyState ? (
          <div className="flex-1 flex items-center justify-center">
            {/* Faded flower watermark */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <img
                src={askAiFlower}
                alt=""
                className="w-36 h-36 opacity-15"
              />
            </motion.div>
          </div>
        ) : (
          <div className="space-y-4 py-4 mt-auto">
            <AnimatePresence>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className="max-w-[88%] space-y-1">
                    {msg.text && (
                      <div
                        className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                          msg.role === "user"
                            ? "bg-primary text-primary-foreground rounded-br-md"
                            : "bg-card border border-border/40 rounded-bl-md"
                        }`}
                      >
                        {msg.role === "ai" ? renderMessageText(msg.text) : msg.text}
                      </div>
                    )}
                    <div className={`flex items-center gap-1.5 px-1 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                      <span className="text-[9px] text-muted-foreground">{formatRelativeTime(msg.timestamp)}</span>
                      {msg.status === "error" && (
                        <button
                          onClick={() => retryMessage(msg.id)}
                          className="flex items-center gap-1 text-[9px] text-health-alert font-medium"
                        >
                          <AlertCircle className="w-3 h-3" />
                          Failed · <RefreshCw className="w-2.5 h-2.5" /> Retry
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isTyping && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                <div className="bg-card border border-border/40 rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </motion.div>
            )}
          </div>
        )}

        {/* ─── QUICK CHIPS (only in empty state) ─── */}
        {isEmptyState && (
          <div className="pb-3 pt-2">
            <div className="flex gap-3">
              {quickChips.map((chip) => (
                <button
                  key={chip.label}
                  onClick={() => sendMessage(chip.label)}
                  className="flex flex-col items-start gap-4 p-4 rounded-2xl bg-white/60 backdrop-blur-sm border border-border/30 flex-1 shadow-sm"
                >
                  <chip.icon size={24} weight="light" className="text-muted-foreground/70" />
                  <span className="text-sm font-medium text-foreground">{chip.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ─── INPUT AREA ─── */}
        <div className="pb-6 pt-2 relative z-10">
          <div
            className="rounded-3xl p-4 pt-3 backdrop-blur-xl"
            style={{
              background: "rgba(255,255,255,0.15)",
              border: "1px solid rgba(255,255,255,0.4)",
              boxShadow: "0 4px 30px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.5)",
            }}
          >
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage(input);
                }
              }}
              placeholder="Ask anything about your health"
              rows={1}
              className="w-full bg-transparent text-sm px-1 py-1 outline-none resize-none max-h-[120px] placeholder:text-muted-foreground/50 text-foreground"
            />
            <div className="flex items-center justify-between mt-2">
              <button className="w-10 h-10 rounded-full backdrop-blur-md flex items-center justify-center" style={{ background: "rgba(255,255,255,0.3)", border: "1px solid rgba(255,255,255,0.4)" }}>
                <Paperclip size={18} weight="light" className="text-muted-foreground/70" />
              </button>
              <button className="w-10 h-10 rounded-full backdrop-blur-md flex items-center justify-center" style={{ background: "rgba(255,255,255,0.3)", border: "1px solid rgba(255,255,255,0.4)" }}>
                <Microphone size={18} weight="light" className="text-muted-foreground/70" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ─── CHAT HISTORY DRAWER ─── */}
      <AnimatePresence>
        {showHistory && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/60 backdrop-blur-sm z-50"
              onClick={() => setShowHistory(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-card z-50 shadow-xl border-l border-border/50"
            >
              <div className="p-5 border-b border-border/50">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold font-serif">Chat History</h2>
                  <button onClick={() => setShowHistory(false)} className="w-8 h-8 rounded-lg bg-muted/60 flex items-center justify-center">
                    <XIcon size={16} className="text-muted-foreground" />
                  </button>
                </div>
              </div>

              <div className="p-5 space-y-2">
                <button
                  onClick={() => { setMessages([]); setShowHistory(false); }}
                  className="w-full bg-card border-2 border-dashed border-primary/20 rounded-xl p-3 flex items-center gap-3 text-left"
                >
                  <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
                    <MessageCircle className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <span className="text-sm font-semibold text-primary">New Conversation</span>
                </button>

                {sampleSessions.map((session) => (
                  <button
                    key={session.id}
                    onClick={() => setShowHistory(false)}
                    className="w-full bg-card border border-border/40 rounded-xl p-3 flex items-start gap-3 text-left"
                  >
                    <div className="w-9 h-9 rounded-xl bg-muted/60 flex items-center justify-center shrink-0 mt-0.5">
                      <MessageCircle className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{session.title}</p>
                      <p className="text-[10px] text-muted-foreground truncate mt-0.5">{session.lastMessage}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <Clock className="w-3 h-3 text-muted-foreground" />
                        <span className="text-[9px] text-muted-foreground">{formatRelativeTime(session.timestamp)}</span>
                        <span className="text-[9px] text-muted-foreground">· {session.messageCount} messages</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
