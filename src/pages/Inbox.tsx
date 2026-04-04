import { useState, useEffect, useRef } from "react";
import { Send, Paperclip, Mic, Phone, Mail, MapPin, Pencil, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import Modal from "@/components/shared/Modal";

interface Conversation {
  id: string;
  contact_name: string;
  last_message: string;
  last_message_at: string;
  unread_count: number;
  contact_id: string;
}

interface Message {
  id: string;
  sender: string;
  content: string;
  created_at: string;
}

const Inbox = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConv, setActiveConv] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [newName, setNewName] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchConversations = async () => {
    const { data } = await supabase.from("conversations").select("*").order("last_message_at", { ascending: false });
    if (data) {
      setConversations(data as Conversation[]);
      if (!activeConv && data.length > 0) setActiveConv(data[0] as Conversation);
    }
  };

  const fetchMessages = async (convId: string) => {
    const { data } = await supabase.from("messages").select("*").eq("conversation_id", convId).order("created_at", { ascending: true });
    if (data) setMessages(data as Message[]);
  };

  useEffect(() => { fetchConversations(); }, []);
  useEffect(() => { if (activeConv) fetchMessages(activeConv.id); }, [activeConv?.id]);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || !activeConv) return;
    const { error } = await supabase.from("messages").insert({
      conversation_id: activeConv.id,
      sender: "user",
      content: input,
    });
    if (error) return toast.error("Failed to send");
    await supabase.from("conversations").update({ last_message: input, last_message_at: new Date().toISOString() }).eq("id", activeConv.id);
    setInput("");
    fetchMessages(activeConv.id);
    fetchConversations();
  };

  const createConversation = async () => {
    if (!newName.trim()) return;
    const { data, error } = await supabase.from("conversations").insert({
      user_id: user!.id,
      contact_name: newName,
      last_message: "",
    }).select().single();
    if (error) return toast.error("Failed to create conversation");
    setShowNew(false);
    setNewName("");
    fetchConversations();
    if (data) setActiveConv(data as Conversation);
  };

  return (
    <div className="flex h-[calc(100vh-56px)] -m-6">
      {/* Left Panel */}
      <div className="w-[240px] bg-card border-r border-border flex flex-col">
        <div className="p-3 border-b border-border flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">Conversations ({conversations.length})</span>
          <button onClick={() => setShowNew(true)} className="text-crm-blue hover:bg-muted rounded p-1"><Plus size={16} /></button>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {conversations.length === 0 ? (
            <div className="p-4 text-sm text-muted-foreground text-center">No conversations yet</div>
          ) : conversations.map((conv) => (
            <div key={conv.id} onClick={() => setActiveConv(conv)} className={`p-3 border-b border-border cursor-pointer flex gap-2 ${activeConv?.id === conv.id ? "bg-crm-blue-light" : "hover:bg-muted/50"}`}>
              <div className="w-10 h-10 rounded-full bg-muted flex-shrink-0 flex items-center justify-center text-xs font-bold text-muted-foreground">
                {conv.contact_name?.[0]?.toUpperCase() || "?"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground truncate">{conv.contact_name}</span>
                  <span className="text-[11px] text-muted-foreground">{conv.last_message_at ? new Date(conv.last_message_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}</span>
                </div>
                <p className="text-xs text-muted-foreground truncate">{conv.last_message || "No messages"}</p>
              </div>
              {conv.unread_count > 0 && (
                <span className="w-5 h-5 rounded-full bg-crm-blue text-primary-foreground text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">{conv.unread_count}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Center Panel */}
      <div className="flex-1 flex flex-col bg-background">
        {activeConv ? (
          <>
            <div className="bg-card border-b border-border p-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">
                {activeConv.contact_name?.[0]?.toUpperCase()}
              </div>
              <div>
                <span className="font-semibold text-sm text-foreground">{activeConv.contact_name}</span>
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-crm-green" /><span className="text-xs text-muted-foreground">Online</span></div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
              {messages.length === 0 && <div className="text-center text-muted-foreground text-sm mt-16">Start the conversation by sending a message</div>}
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div>
                    <div className={`px-3.5 py-2.5 text-sm max-w-[320px] ${msg.sender === "user" ? "bg-crm-blue text-primary-foreground rounded-xl rounded-br-sm" : "bg-card border border-border text-foreground rounded-xl rounded-bl-sm"}`}>
                      {msg.content}
                    </div>
                    <div className={`text-[11px] text-muted-foreground mt-1 ${msg.sender === "user" ? "text-right" : ""}`}>
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="bg-card border-t border-border p-3 flex items-center gap-3">
              <input className="flex-1 border border-border rounded-lg px-4 py-2 text-sm bg-background" placeholder="Type message..." value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendMessage()} />
              <button onClick={sendMessage} className="w-9 h-9 rounded-full bg-crm-blue flex items-center justify-center hover:bg-crm-blue-dark transition-colors">
                <Send size={16} className="text-primary-foreground" />
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">Select or create a conversation</div>
        )}
      </div>

      {/* Right Panel */}
      {activeConv && (
        <div className="w-[220px] bg-card border-l border-border p-4">
          <div className="flex items-center gap-2 mb-4">
            <button className="text-sm font-medium text-crm-blue border-b-2 border-crm-blue pb-1">Details</button>
            <button className="text-sm text-muted-foreground pb-1">Activity</button>
          </div>
          <div className="flex flex-col items-center mb-4">
            <div className="w-16 h-16 rounded-full bg-muted mb-2 flex items-center justify-center text-xl font-bold text-muted-foreground">
              {activeConv.contact_name?.[0]?.toUpperCase()}
            </div>
            <span className="font-semibold text-sm text-foreground">{activeConv.contact_name}</span>
          </div>
        </div>
      )}

      {showNew && (
        <Modal title="New Conversation" onClose={() => setShowNew(false)}>
          <input className="border border-border rounded-lg px-4 py-2.5 text-sm w-full bg-background" placeholder="Contact Name" value={newName} onChange={(e) => setNewName(e.target.value)} />
          <div className="flex justify-end mt-4">
            <button onClick={createConversation} className="bg-crm-blue text-primary-foreground px-5 py-2 rounded-lg text-sm font-medium hover:bg-crm-blue-dark">Create</button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Inbox;
