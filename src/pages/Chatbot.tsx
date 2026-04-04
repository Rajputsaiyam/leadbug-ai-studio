import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import StatusBadge from "@/components/shared/StatusBadge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Message {
  role: "user" | "assistant" | "escalation";
  content: string;
  timestamp: string;
}

const Chatbot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(() => Math.random().toString(36).slice(2));
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const userMsg: Message = { role: "user", content: input, timestamp: now };
    setMessages((p) => [...p, userMsg]);
    const userInput = input;
    setInput("");
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("chatbot", {
        body: { message: userInput, sessionId },
      });
      if (error) throw error;
      const botMsg: Message = { role: "assistant", content: data.reply || "I'm not sure how to respond to that.", timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) };
      setMessages((p) => [...p, botMsg]);
      if (data.escalated) {
        setMessages((p) => [...p, { role: "escalation", content: "Connecting you to a human agent...", timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
      }
    } catch {
      setMessages((p) => [...p, { role: "assistant", content: "Sorry, I'm having trouble right now. Please try again.", timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-6 h-[calc(100vh-56px-48px)]">
      <div className="w-[30%] bg-card rounded-xl border border-border p-6">
        <h2 className="text-lg font-semibold text-foreground mb-2">AI Chatbot</h2>
        <p className="text-sm text-muted-foreground mb-6">Test your AI chatbot below</p>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-foreground">Knowledge base:</span>
            <StatusBadge status="Active" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-foreground">Escalation:</span>
            <span className="badge-info inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">Enabled</span>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-card rounded-xl border border-border flex flex-col overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <div className="w-8 h-8 rounded-full bg-crm-blue flex items-center justify-center text-primary-foreground text-xs font-bold">AI</div>
          <div>
            <div className="font-semibold text-sm text-foreground">AI Assistant</div>
            <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-crm-green" /><span className="text-xs text-muted-foreground">Online</span></div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          {messages.length === 0 && <div className="text-center text-muted-foreground text-sm mt-16">Start a conversation with the AI chatbot</div>}
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              {msg.role === "escalation" ? (
                <div className="badge-warning rounded-lg px-4 py-3 text-sm max-w-[70%]">{msg.content}</div>
              ) : (
                <div>
                  <div className={`px-3.5 py-2.5 text-sm max-w-[70%] ${msg.role === "user" ? "bg-crm-blue text-primary-foreground rounded-xl rounded-br-sm" : "bg-muted text-foreground rounded-xl rounded-bl-sm"}`}>
                    {msg.content}
                  </div>
                  <div className={`text-[11px] text-muted-foreground mt-1 ${msg.role === "user" ? "text-right" : ""}`}>{msg.timestamp}</div>
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-xl rounded-bl-sm px-4 py-3">
                <span className="typing-dot" /><span className="typing-dot" /><span className="typing-dot" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="border-t border-border p-3 flex items-center gap-3">
          <input className="flex-1 border border-border rounded-lg px-4 py-2.5 text-sm bg-background" placeholder="Type your message..." value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendMessage()} />
          <button onClick={sendMessage} className="w-9 h-9 rounded-full bg-crm-blue flex items-center justify-center hover:bg-crm-blue-dark transition-colors">
            <Send size={16} className="text-primary-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
