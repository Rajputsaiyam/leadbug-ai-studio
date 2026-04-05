import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, RotateCcw } from "lucide-react";
import ReactMarkdown from "react-markdown";
import StatusBadge from "@/components/shared/StatusBadge";

interface Message {
  role: "user" | "assistant" | "escalation";
  content: string;
  timestamp: string;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chatbot`;

const Chatbot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const userMsg: Message = { role: "user", content: input, timestamp: now };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    const userInput = input;
    setInput("");
    setLoading(true);

    // Build conversation history for AI
    const aiMessages = newMessages
      .filter(m => m.role !== "escalation")
      .map(m => ({ role: m.role as "user" | "assistant", content: m.content }));

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: aiMessages }),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        throw new Error(err.error || "Failed to get response");
      }

      if (!resp.body) throw new Error("No response body");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let assistantContent = "";
      let streamDone = false;

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") { streamDone = true; break; }

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantContent += content;
              setMessages(prev => {
                const last = prev[prev.length - 1];
                if (last?.role === "assistant") {
                  return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantContent } : m);
                }
                return [...prev, { role: "assistant", content: assistantContent, timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }];
              });
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      // Check for escalation
      if (assistantContent.includes("[ESCALATE]")) {
        setMessages(prev => [
          ...prev.map(m => m.role === "assistant" && m.content.includes("[ESCALATE]") ? { ...m, content: m.content.replace("[ESCALATE]", "").trim() } : m),
          { role: "escalation" as const, content: "🔔 Connecting you to a human agent...", timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) },
        ]);
      }
    } catch (e: any) {
      setMessages(prev => [...prev, { role: "assistant", content: "Sorry, I'm having trouble right now. Please try again.", timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-6 h-[calc(100vh-56px-48px)]">
      <div className="w-[280px] bg-card rounded-xl border border-border p-6 flex flex-col">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles size={20} className="text-crm-blue" />
          <h2 className="text-lg font-semibold text-foreground">AI Assistant</h2>
        </div>
        <p className="text-sm text-muted-foreground mb-6">Powered by Lovable AI — ask anything about LeadBug CRM.</p>
        <div className="space-y-3 flex-1">
          <div className="flex items-center justify-between">
            <span className="text-sm text-foreground">Status</span>
            <StatusBadge status="Active" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-foreground">Escalation</span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-crm-blue/10 text-crm-blue">Enabled</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-foreground">Model</span>
            <span className="text-xs text-muted-foreground">Gemini Flash</span>
          </div>
        </div>
        <button onClick={() => setMessages([])} className="mt-4 border border-border rounded-lg px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors flex items-center gap-2 justify-center">
          <RotateCcw size={14} /> Clear Chat
        </button>
      </div>

      <div className="flex-1 bg-card rounded-xl border border-border flex flex-col overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-crm-blue to-indigo-500 flex items-center justify-center text-primary-foreground text-xs font-bold">AI</div>
          <div>
            <div className="font-semibold text-sm text-foreground">LeadBug AI</div>
            <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-crm-green" /><span className="text-xs text-muted-foreground">Online</span></div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          {messages.length === 0 && (
            <div className="text-center mt-16 space-y-3">
              <div className="w-16 h-16 rounded-full bg-crm-blue/10 flex items-center justify-center mx-auto">
                <Sparkles size={28} className="text-crm-blue" />
              </div>
              <p className="text-muted-foreground text-sm">Ask me anything about LeadBug CRM</p>
              <div className="flex flex-wrap gap-2 justify-center max-w-md mx-auto">
                {["How to create a template?", "Set up a campaign", "Import contacts", "View analytics"].map(q => (
                  <button key={q} onClick={() => { setInput(q); }} className="text-xs border border-border rounded-full px-3 py-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">{q}</button>
                ))}
              </div>
            </div>
          )}
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              {msg.role === "escalation" ? (
                <div className="bg-amber-500/10 text-amber-700 border border-amber-500/20 rounded-lg px-4 py-3 text-sm max-w-[80%]">{msg.content}</div>
              ) : (
                <div className={`max-w-[75%]`}>
                  <div className={`px-4 py-3 text-sm ${msg.role === "user" ? "bg-crm-blue text-primary-foreground rounded-2xl rounded-br-sm" : "bg-muted text-foreground rounded-2xl rounded-bl-sm"}`}>
                    {msg.role === "assistant" ? (
                      <div className="prose prose-sm dark:prose-invert max-w-none [&_p]:mb-1 [&_ul]:mb-1 [&_ol]:mb-1 [&_li]:mb-0">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    ) : msg.content}
                  </div>
                  <div className={`text-[11px] text-muted-foreground mt-1 ${msg.role === "user" ? "text-right" : ""}`}>{msg.timestamp}</div>
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="border-t border-border p-3 flex items-center gap-3">
          <input className="flex-1 border border-border rounded-lg px-4 py-2.5 text-sm bg-background focus:ring-2 focus:ring-crm-blue/20 focus:border-crm-blue transition-all" placeholder="Type your message..." value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendMessage()} />
          <button onClick={sendMessage} disabled={loading || !input.trim()} className="w-10 h-10 rounded-full bg-crm-blue flex items-center justify-center hover:bg-crm-blue-dark transition-colors disabled:opacity-50">
            <Send size={16} className="text-primary-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
