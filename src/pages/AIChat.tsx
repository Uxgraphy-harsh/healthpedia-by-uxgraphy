import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Send, Sparkles, History, Settings, Activity, Upload, Bell, Ruler,
  FileText, Paperclip, Image, File, X, AlertCircle, RefreshCw,
  ChevronRight, Clock, MessageCircle, Pill, HelpCircle
} from "lucide-react";

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

const quickActions = [
  { icon: Activity, label: "Log Symptom", path: "/track" },
  { icon: Upload, label: "Upload Report", path: "/records" },
  { icon: Bell, label: "Add Reminder", path: "/reminders" },
  { icon: Ruler, label: "Measurement", path: "/track" },
  { icon: FileText, label: "View Reports", path: "/records" },
];

const suggestedPrompts = [
  { icon: Activity, text: "Log a symptom", color: "text-health-watch" },
  { icon: Upload, text: "Upload a medical report", color: "text-primary" },
  { icon: HelpCircle, text: "Ask a health question", color: "text-secondary" },
  { icon: Pill, text: "Add a medication reminder", color: "text-health-good" },
];

const smartResponses: Record<string, string> = {
  "Explain my last blood report":
    "Based on your last blood report (March 2, 2026):\n\n• **HbA1c: 6.8%** — Slightly above normal range (4.0-5.6%). This indicates pre-diabetic levels.\n• **Fasting Glucose: 118 mg/dL** — Above normal (70-100 mg/dL). Suggest dietary adjustments.\n• **Cholesterol: 185 mg/dL** — Within normal range (<200 mg/dL). ✓\n\nI'd recommend discussing dietary changes with Dr. Sharma at your next appointment.",
  "Can I eat mango with high sugar?":
    "Given your recent fasting glucose of **118 mg/dL**, I'd suggest moderation:\n\n• A small portion (½ cup) of mango is fine\n• Pair it with protein or healthy fats to slow sugar absorption\n• Best time to eat: after a meal, not on an empty stomach\n• Monitor your glucose levels after eating\n\n**Tip:** Green mangoes have a lower glycemic index than ripe ones.",
  "Why is my heart rate higher today?":
    "Your resting heart rate today is **78 bpm**, up from your average of **72 bpm**. Possible causes:\n\n• **Sleep:** Only 5.8 hours last night (below your 7h average)\n• **Caffeine:** You logged coffee intake this morning\n• **Stress:** Consider if you've been under more stress\n\n**Recommendation:** Try to get 7+ hours of sleep tonight and limit caffeine after 2 PM.",
  "What should I eat tonight?":
    "Based on your health profile and today's activity:\n\n**Suggested Dinner:**\n• Grilled fish or chicken (lean protein)\n• Roasted vegetables (fiber + nutrients)\n• Quinoa or brown rice (complex carbs)\n\n**Avoid:**\n• Heavy carbs (white rice, bread)\n• Sugary desserts\n• Late-night snacking\n\nThis keeps your glucose stable while providing the nutrients you need.",
};

// ─── Attachment Type Icon ───────────────────────────────────────────────────────

function AttachmentIcon({ type }: { type: Attachment["type"] }) {
  if (type === "pdf") return <FileText className="w-4 h-4 text-health-alert" />;
  if (type === "image") return <Image className="w-4 h-4 text-primary" />;
  return <File className="w-4 h-4 text-muted-foreground" />;
}

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
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [pendingAttachments, setPendingAttachments] = useState<Attachment[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [messages, isTyping]);

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 120) + "px";
    }
  }, [input]);

  const sendMessage = (text: string) => {
    if (!text.trim() && pendingAttachments.length === 0) return;

    const userMsg: Message = {
      id: Date.now(),
      role: "user",
      text: text.trim(),
      timestamp: new Date(),
      attachments: pendingAttachments.length > 0 ? [...pendingAttachments] : undefined,
      status: "sent",
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setPendingAttachments([]);
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = smartResponses[text.trim()] ||
        "I can see from your health records that you've been maintaining a generally stable health profile. Could you be more specific about what you'd like to know? I can help with:\n\n• Blood reports & lab results\n• Medication guidance\n• Symptom analysis\n• Dietary recommendations\n• Health trend insights";

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

  const addAttachment = (type: Attachment["type"]) => {
    const names: Record<string, string> = { pdf: "Medical_Report.pdf", image: "Lab_Result.jpg", document: "Prescription.docx" };
    setPendingAttachments((prev) => [
      ...prev,
      { id: `att-${Date.now()}`, name: names[type], type, size: "2.4 MB" },
    ]);
    setShowAttachMenu(false);
  };

  const removeAttachment = (id: string) => {
    setPendingAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const isEmptyState = messages.length === 0;

  // ─── Render: Markdown-like formatting ─────────────────────────────────────────

  function renderMessageText(text: string) {
    const lines = text.split("\n");
    return lines.map((line, i) => {
      // Bold
      const formatted = line.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>');
      // Bullet points
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
    <div className="mobile-container flex flex-col h-screen">
      {/* ─── HEADER ─── */}
      <div className="px-5 pt-6 pb-3 border-b border-border/50 bg-card/80 backdrop-blur-md z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl gradient-primary flex items-center justify-center shadow-sm">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-base font-bold font-serif">Health Assistant</h1>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-health-good animate-pulse-soft" />
                <p className="text-[10px] text-muted-foreground">Your personal health companion</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowHistory(true)}
              className="w-9 h-9 rounded-xl bg-muted/60 flex items-center justify-center"
            >
              <History className="w-4 h-4 text-muted-foreground" />
            </button>
            <button
              onClick={() => navigate("/profile")}
              className="w-9 h-9 rounded-xl bg-muted/60 flex items-center justify-center"
            >
              <Settings className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>
      </div>

      {/* ─── QUICK ACTIONS ─── */}
      <div className="px-5 py-3 border-b border-border/30">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {quickActions.map((action) => (
            <button
              key={action.label}
              onClick={() => navigate(action.path)}
              className="shrink-0 glass-card px-3 py-2 flex items-center gap-2"
            >
              <action.icon className="w-3.5 h-3.5 text-primary" />
              <span className="text-[11px] font-medium text-foreground whitespace-nowrap">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ─── CONVERSATION AREA ─── */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4">
        {isEmptyState ? (
          /* ─── EMPTY STATE ─── */
          <div className="flex flex-col items-center justify-center h-full">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center mb-8"
            >
              <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-5 shadow-lg">
                <MessageCircle className="w-8 h-8 text-primary-foreground" />
              </div>
              <h2 className="text-lg font-bold font-serif mb-2">Hello! 👋</h2>
              <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
                How can I help with your health today? I have access to your records, vitals, and medications.
              </p>
            </motion.div>

            <div className="w-full space-y-2">
              {suggestedPrompts.map((prompt, i) => (
                <motion.button
                  key={prompt.text}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.08 }}
                  onClick={() => sendMessage(prompt.text)}
                  className="glass-card p-3.5 w-full flex items-center gap-3 text-left"
                >
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <prompt.icon className={`w-4 h-4 ${prompt.color}`} />
                  </div>
                  <span className="text-sm font-medium text-foreground">{prompt.text}</span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto" />
                </motion.button>
              ))}
            </div>
          </div>
        ) : (
          /* ─── MESSAGES ─── */
          <div className="space-y-4">
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
                    {/* Attachments */}
                    {msg.attachments && msg.attachments.length > 0 && (
                      <div className={`flex flex-col gap-1.5 ${msg.role === "user" ? "items-end" : "items-start"}`}>
                        {msg.attachments.map((att) => (
                          <div key={att.id} className="glass-card px-3 py-2 flex items-center gap-2 max-w-[200px]">
                            <AttachmentIcon type={att.type} />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium truncate">{att.name}</p>
                              {att.size && <p className="text-[9px] text-muted-foreground">{att.size}</p>}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Message Bubble */}
                    {msg.text && (
                      <div
                        className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                          msg.role === "user"
                            ? "gradient-primary text-primary-foreground rounded-br-md"
                            : "glass-card rounded-bl-md"
                        }`}
                      >
                        {msg.role === "ai" ? renderMessageText(msg.text) : msg.text}
                      </div>
                    )}

                    {/* Timestamp + Status */}
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

            {/* Typing Indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="glass-card rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>

      {/* ─── PENDING ATTACHMENTS ─── */}
      {pendingAttachments.length > 0 && (
        <div className="px-5 pb-2">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {pendingAttachments.map((att) => (
              <div key={att.id} className="shrink-0 glass-card px-2.5 py-1.5 flex items-center gap-2">
                <AttachmentIcon type={att.type} />
                <span className="text-[10px] font-medium truncate max-w-[100px]">{att.name}</span>
                <button onClick={() => removeAttachment(att.id)}>
                  <X className="w-3 h-3 text-muted-foreground" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── INPUT AREA ─── */}
      <div className="px-5 pb-24 pt-2 border-t border-border/50 bg-card/80 backdrop-blur-md">
        {/* Attachment Menu */}
        <AnimatePresence>
          {showAttachMenu && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="flex gap-2 mb-2"
            >
              {[
                { type: "pdf" as const, icon: FileText, label: "PDF Report" },
                { type: "image" as const, icon: Image, label: "Photo" },
                { type: "document" as const, icon: File, label: "Document" },
              ].map((opt) => (
                <button
                  key={opt.type}
                  onClick={() => addAttachment(opt.type)}
                  className="glass-card flex-1 py-2.5 flex flex-col items-center gap-1.5"
                >
                  <opt.icon className="w-4 h-4 text-primary" />
                  <span className="text-[10px] font-medium text-muted-foreground">{opt.label}</span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-end gap-2 glass-card p-2 pr-3">
          <button
            onClick={() => setShowAttachMenu(!showAttachMenu)}
            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
              showAttachMenu ? "bg-primary/10" : "bg-muted"
            }`}
          >
            <Paperclip className={`w-4 h-4 ${showAttachMenu ? "text-primary" : "text-muted-foreground"}`} />
          </button>
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
            placeholder="Ask about your health..."
            rows={1}
            className="flex-1 bg-transparent text-sm px-2 py-2 outline-none resize-none max-h-[120px]"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() && pendingAttachments.length === 0}
            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all ${
              input.trim() || pendingAttachments.length > 0
                ? "gradient-primary shadow-sm"
                : "bg-muted"
            }`}
          >
            <Send className={`w-4 h-4 ${input.trim() || pendingAttachments.length > 0 ? "text-primary-foreground" : "text-muted-foreground"}`} />
          </button>
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
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 bottom-0 w-[85%] max-w-sm bg-card z-50 shadow-xl border-r border-border/50"
            >
              <div className="p-5 border-b border-border/50">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold font-serif">Chat History</h2>
                  <button onClick={() => setShowHistory(false)} className="w-8 h-8 rounded-lg bg-muted/60 flex items-center justify-center">
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
              </div>

              <div className="p-5 space-y-2">
                {/* New Chat */}
                <button
                  onClick={() => {
                    setMessages([]);
                    setShowHistory(false);
                  }}
                  className="w-full glass-card p-3 flex items-center gap-3 text-left border-2 border-dashed border-primary/20"
                >
                  <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
                    <MessageCircle className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <span className="text-sm font-semibold text-primary">New Conversation</span>
                </button>

                {/* Sessions */}
                {sampleSessions.map((session) => (
                  <button
                    key={session.id}
                    onClick={() => setShowHistory(false)}
                    className="w-full glass-card p-3 flex items-start gap-3 text-left"
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
