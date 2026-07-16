import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ClockCounterClockwise,
  FileText as FileTextIcon,
  Heartbeat,
  Microphone,
  Paperclip,
  X as XIcon,
  SquaresFour,
  Gear,
  Bell,
  UserCircle,
} from "@phosphor-icons/react";
import { AlertCircle, Clock, MessageCircle, RefreshCw } from "lucide-react";
import askAiFlower from "@/assets/ask-ai-flower.svg";
import AppLauncher from "@/components/AppLauncher";


interface Message {
  id: number;
  role: "user" | "ai";
  text: string;
  timestamp: Date;
  status?: "sending" | "sent" | "error";
}

interface ChatSession {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messageCount: number;
}

const sampleSessions: ChatSession[] = [
  {
    id: "s1",
    title: "Blood Report Discussion",
    lastMessage: "Your HbA1c levels are slightly elevated...",
    timestamp: new Date("2026-03-10T14:30:00"),
    messageCount: 8,
  },
  {
    id: "s2",
    title: "Diet Recommendations",
    lastMessage: "For dinner, I'd suggest grilled chicken...",
    timestamp: new Date("2026-03-09T18:00:00"),
    messageCount: 12,
  },
  {
    id: "s3",
    title: "Medication Review",
    lastMessage: "Metformin should be taken with food...",
    timestamp: new Date("2026-03-08T09:00:00"),
    messageCount: 5,
  },
];

const quickChips = [
  { icon: Heartbeat, label: "Log symptoms" },
  { icon: FileTextIcon, label: "Analyze Reports" },
];

const smartResponses: Record<string, string> = {
  "Log symptoms": "Sure — tell me what symptom you want to log, how severe it feels, and when it started.",
  "Analyze Reports": "I can help analyze a report. Upload one or tell me which report you want me to review.",
};

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

function GlassComposer({
  input,
  inputRef,
  onChange,
  onSend,
}: {
  input: string;
  inputRef: React.RefObject<HTMLTextAreaElement>;
  onChange: (value: string) => void;
  onSend: () => void;
}) {
  return (
    <div
      className="rounded-2xl border px-4 py-3 backdrop-blur-2xl"
      style={{
        background: "hsl(var(--card) / 0.22)",
        borderColor: "hsl(var(--border) / 0.55)",
        boxShadow:
          "0 20px 50px -18px hsl(var(--foreground) / 0.10), inset 0 1px 0 hsl(var(--card) / 0.70)",
      }}
    >
      <textarea
        ref={inputRef}
        value={input}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onSend();
          }
        }}
        placeholder="Ask anything about your health"
        rows={1}
        className="w-full resize-none bg-transparent px-0 py-1 text-[15px] text-foreground outline-none placeholder:text-muted-foreground/60"
      />

      <div className="mt-2 flex items-center justify-between">
        <button
          className="flex h-9 w-9 items-center justify-center rounded-full border backdrop-blur-xl"
          style={{
            background: "hsl(var(--card) / 0.42)",
            borderColor: "hsl(var(--border) / 0.5)",
          }}
        >
          <Paperclip size={17} weight="light" className="text-muted-foreground" />
        </button>
        <button
          className="flex h-9 w-9 items-center justify-center rounded-full border backdrop-blur-xl"
          style={{
            background: "hsl(var(--card) / 0.42)",
            borderColor: "hsl(var(--border) / 0.5)",
          }}
        >
          <Microphone size={17} weight="light" className="text-muted-foreground" />
        </button>
      </div>
    </div>
  );
}

export default function AIChat() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showLauncher, setShowLauncher] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);



  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  useEffect(() => {
    if (!inputRef.current) return;
    inputRef.current.style.height = "auto";
    inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 120)}px`;
  }, [input]);

  const sendMessage = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      text: trimmed,
      timestamp: new Date(),
      status: "sent",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    window.setTimeout(() => {
      const reply =
        smartResponses[trimmed] ||
        "I can help with symptoms, reports, medications, and general health questions. Tell me what you want to know.";

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "ai",
          text: reply,
          timestamp: new Date(),
          status: "sent",
        },
      ]);
      setIsTyping(false);
    }, 1200);
  };

  const retryMessage = (msgId: number) => {
    setMessages((prev) => prev.map((msg) => (msg.id === msgId ? { ...msg, status: "sent" } : msg)));
  };

  const isEmptyState = messages.length === 0;

  return (
    <div className="fixed inset-0 z-50 mx-auto flex h-[100dvh] w-full max-w-md flex-col overflow-hidden bg-background">
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[34%]"
        style={{
          background:
            "linear-gradient(180deg, hsl(var(--primary) / 0) 0%, hsl(var(--primary) / 0.10) 55%, hsl(var(--primary) / 0.20) 100%)",
        }}
      />

      <header className="relative z-10 flex items-center justify-between px-4 pb-3 pt-4">
        <button
          onClick={() => setShowLauncher(true)}
          className="flex h-11 w-11 items-center justify-center rounded-2xl border backdrop-blur-xl"
          style={{
            background: "hsl(var(--card) / 0.55)",
            borderColor: "hsl(var(--border) / 0.55)",
            boxShadow: "inset 0 1px 0 hsl(var(--card) / 0.75)",
          }}
          aria-label="Mini apps"
        >
          <SquaresFour size={22} weight="bold" className="text-foreground" />
        </button>

        <div
          className="flex items-center gap-1 rounded-full border p-1 backdrop-blur-xl"
          style={{
            background: "hsl(var(--card) / 0.55)",
            borderColor: "hsl(var(--border) / 0.55)",
            boxShadow: "inset 0 1px 0 hsl(var(--card) / 0.75)",
          }}
        >
          <button
            onClick={() => setShowNotifications(true)}
            className="relative flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted/50"
            aria-label="Notifications"
          >
            <Bell size={19} weight="regular" className="text-foreground/80" />
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#F66B9A]" />
          </button>

          <button
            onClick={() => navigate("/settings/app-lock")}
            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted/50"
            aria-label="Settings"
          >
            <Gear size={19} weight="regular" className="text-foreground/80" />
          </button>
          <button
            onClick={() => navigate("/profile")}
            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted/50"
            aria-label="Profile"
          >
            <UserCircle size={22} weight="fill" className="text-[#60A5FA]" />
          </button>
        </div>
      </header>


      {isEmptyState ? (
        <main className="relative flex-1 overflow-hidden">
          <div className="pointer-events-none absolute inset-x-0 top-[34%] flex -translate-y-1/2 justify-center">
            <motion.img
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              src={askAiFlower}
              alt=""
              className="h-32 w-32 grayscale opacity-[0.10]"
            />
          </div>

          <div className="absolute inset-x-0 bottom-0 px-4 pb-8 pt-3">
            <div className="mb-2.5 grid grid-cols-2 gap-2.5">
              {quickChips.map((chip) => (
                <button
                  key={chip.label}
                  onClick={() => sendMessage(chip.label)}
                  className="flex flex-col items-start gap-3 rounded-2xl border px-4 py-3.5 text-left backdrop-blur-2xl"
                  style={{
                    background: "hsl(var(--card) / 0.18)",
                    borderColor: "hsl(var(--border) / 0.35)",
                    boxShadow: "0 8px 32px -12px hsl(var(--foreground) / 0.08), inset 0 1px 0 hsl(255 255 255 / 0.12), inset 0 -1px 0 hsl(var(--foreground) / 0.04)",
                  }}
                >
                  <chip.icon size={22} weight="light" className="text-muted-foreground/80" />
                  <span className="text-[13px] font-medium text-foreground">{chip.label}</span>
                </button>
              ))}
            </div>

            <GlassComposer
              input={input}
              inputRef={inputRef}
              onChange={setInput}
              onSend={() => sendMessage(input)}
            />
          </div>
        </main>
      ) : (
        <main className="relative flex-1 overflow-hidden">
          <div ref={scrollRef} className="h-full overflow-y-auto px-5 pb-44 pt-2">
            <div className="space-y-4 py-4">
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
                      <div
                        className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                          msg.role === "user"
                            ? "rounded-br-md bg-primary text-primary-foreground"
                            : "rounded-bl-md border border-border/40 bg-card/90"
                        }`}
                      >
                        {msg.text}
                      </div>

                      <div className={`flex items-center gap-1.5 px-1 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                        <span className="text-[9px] text-muted-foreground">{formatRelativeTime(msg.timestamp)}</span>
                        {msg.status === "error" && (
                          <button
                            onClick={() => retryMessage(msg.id)}
                            className="flex items-center gap-1 text-[9px] font-medium text-health-alert"
                          >
                            <AlertCircle className="h-3 w-3" />
                            Failed · <RefreshCw className="h-2.5 w-2.5" /> Retry
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {isTyping && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                  <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-border/40 bg-card/90 px-4 py-3">
                    <div className="h-2 w-2 animate-bounce rounded-full bg-primary/60" style={{ animationDelay: "0ms" }} />
                    <div className="h-2 w-2 animate-bounce rounded-full bg-primary/60" style={{ animationDelay: "150ms" }} />
                    <div className="h-2 w-2 animate-bounce rounded-full bg-primary/60" style={{ animationDelay: "300ms" }} />
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 px-5 pb-8 pt-3">
            <GlassComposer
              input={input}
              inputRef={inputRef}
              onChange={setInput}
              onSend={() => sendMessage(input)}
            />
          </div>
        </main>
      )}

      <AnimatePresence>
        {showHistory && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-background/60 backdrop-blur-sm"
              onClick={() => setShowHistory(false)}
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed bottom-0 right-0 top-0 z-50 w-[85%] max-w-sm border-l border-border/50 bg-card shadow-xl"
            >
              <div className="border-b border-border/50 p-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold font-serif">Chat History</h2>
                  <button
                    onClick={() => setShowHistory(false)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted/60"
                  >
                    <XIcon size={16} className="text-muted-foreground" />
                  </button>
                </div>
              </div>

              <div className="space-y-2 p-5">
                <button
                  onClick={() => {
                    setMessages([]);
                    setShowHistory(false);
                  }}
                  className="flex w-full items-center gap-3 rounded-xl border-2 border-dashed border-primary/20 bg-card p-3 text-left"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
                    <MessageCircle className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <span className="text-sm font-semibold text-primary">New Conversation</span>
                </button>

                {sampleSessions.map((session) => (
                  <button
                    key={session.id}
                    onClick={() => setShowHistory(false)}
                    className="flex w-full items-start gap-3 rounded-xl border border-border/40 bg-card p-3 text-left"
                  >
                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-muted/60">
                      <MessageCircle className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{session.title}</p>
                      <p className="mt-0.5 truncate text-[10px] text-muted-foreground">{session.lastMessage}</p>
                      <div className="mt-1.5 flex items-center gap-2">
                        <Clock className="h-3 w-3 text-muted-foreground" />
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

      <AppLauncher open={showLauncher} onClose={() => setShowLauncher(false)} />
    </div>
  );
}

