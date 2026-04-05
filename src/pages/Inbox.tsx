import { useState, useEffect, useRef } from "react";
import { Send, Plus, Search, Filter, User, Phone, Mail } from "lucide-react";
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
  contact_id: string | null;
}

interface Message {
  id: string;
  sender: string;
  content: string;
  created_at: string;
  read: boolean;
}

interface Contact {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
}

const Inbox = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConv, setActiveConv] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [newName, setNewName] = useState("");
  const [search, setSearch] = useState("");
  const [filterUnread, setFilterUnread] = useState(false);
  const [contactInfo, setContactInfo] = useState<Contact | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContactId, setSelectedContactId] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchConversations = async () => {
    const { data } = await supabase.from("conversations").select("*").order("last_message_at", { ascending: false });
    if (data) setConversations(data as Conversation[]);
  };

  const fetchMessages = async (convId: string) => {
    const { data } = await supabase.from("messages").select("*").eq("conversation_id", convId).order("created_at", { ascending: true });
    if (data) setMessages(data as Message[]);
  };

  const fetchContactInfo = async (contactId: string | null) => {
    if (!contactId) { setContactInfo(null); return; }
    const { data } = await supabase.from("contacts").select("id, name, phone, email").eq("id", contactId).single();
    if (data) setContactInfo(data as Contact);
  };

  const fetchContacts = async () => {
    const { data } = await supabase.from("contacts").select("id, name, phone, email");
    if (data) setContacts(data as Contact[]);
  };

  useEffect(() => { fetchConversations(); fetchContacts(); }, []);

  useEffect(() => {
    if (activeConv) {
      fetchMessages(activeConv.id);
      fetchContactInfo(activeConv.contact_id);
      // Mark as read
      supabase.from("conversations").update({ unread_count: 0 }).eq("id", activeConv.id).then(() => {
        setConversations(prev => prev.map(c => c.id === activeConv.id ? { ...c, unread_count: 0 } : c));
      });
    }
  }, [activeConv?.id]);

  // Real-time subscriptions
  useEffect(() => {
    const msgChannel = supabase
      .channel("inbox-messages")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, (payload) => {
        const newMsg = payload.new as Message;
        if (activeConv && newMsg.conversation_id === activeConv.id) {
          setMessages(prev => [...prev, { id: newMsg.id, sender: newMsg.sender, content: newMsg.content, created_at: newMsg.created_at, read: newMsg.read ?? false }]);
        }
        fetchConversations();
      })
      .subscribe();

    const convChannel = supabase
      .channel("inbox-conversations")
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "conversations" }, () => {
        fetchConversations();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(msgChannel);
      supabase.removeChannel(convChannel);
    };
  }, [activeConv?.id]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || !activeConv) return;
    const content = input.trim();
    setInput("");
    // Optimistic update
    const tempMsg: Message = { id: crypto.randomUUID(), sender: "user", content, created_at: new Date().toISOString(), read: true };
    setMessages(prev => [...prev, tempMsg]);

    const { error } = await supabase.from("messages").insert({ conversation_id: activeConv.id, sender: "user", content });
    if (error) { toast.error("Failed to send"); return; }
    await supabase.from("conversations").update({ last_message: content, last_message_at: new Date().toISOString() }).eq("id", activeConv.id);
  };

  const createConversation = async () => {
    if (!newName.trim()) return;
    const { data, error } = await supabase.from("conversations").insert({
      user_id: user!.id,
      contact_name: newName.trim(),
      contact_id: selectedContactId || null,
      last_message: "",
    }).select().single();
    if (error) return toast.error("Failed to create conversation");
    setShowNew(false);
    setNewName("");
    setSelectedContactId("");
    fetchConversations();
    if (data) setActiveConv(data as Conversation);
  };

  const filtered = conversations.filter(c => {
    const matchesSearch = !search || c.contact_name?.toLowerCase().includes(search.toLowerCase()) || c.last_message?.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = !filterUnread || (c.unread_count > 0);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="flex h-[calc(100vh-56px)] -m-6">
      {/* Left Panel */}
      <div className="w-[280px] bg-card border-r border-border flex flex-col">
        <div className="p-3 border-b border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-foreground">Conversations</span>
            <button onClick={() => setShowNew(true)} className="text-crm-blue hover:bg-muted rounded p-1.5 transition-colors"><Plus size={16} /></button>
          </div>
          <div className="relative mb-2">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input className="border border-border rounded-lg pl-9 pr-3 py-2 text-xs w-full bg-background" placeholder="Search conversations..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="flex gap-1">
            <button onClick={() => setFilterUnread(false)} className={`text-xs px-3 py-1 rounded-full transition-colors ${!filterUnread ? "bg-crm-blue text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}>All</button>
            <button onClick={() => setFilterUnread(true)} className={`text-xs px-3 py-1 rounded-full transition-colors ${filterUnread ? "bg-crm-blue text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}>Unread</button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {filtered.length === 0 ? (
            <div className="p-4 text-sm text-muted-foreground text-center">No conversations</div>
          ) : filtered.map((conv) => (
            <div key={conv.id} onClick={() => setActiveConv(conv)} className={`p-3 border-b border-border cursor-pointer flex gap-2 transition-colors ${activeConv?.id === conv.id ? "bg-crm-blue/5 border-l-2 border-l-crm-blue" : "hover:bg-muted/50"}`}>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-crm-blue/20 to-indigo-500/20 flex-shrink-0 flex items-center justify-center text-xs font-bold text-crm-blue">
                {conv.contact_name?.[0]?.toUpperCase() || "?"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground truncate">{conv.contact_name}</span>
                  <span className="text-[10px] text-muted-foreground">{conv.last_message_at ? new Date(conv.last_message_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}</span>
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
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-crm-blue/20 to-indigo-500/20 flex items-center justify-center text-xs font-bold text-crm-blue">
                {activeConv.contact_name?.[0]?.toUpperCase()}
              </div>
              <div className="flex-1">
                <span className="font-semibold text-sm text-foreground">{activeConv.contact_name}</span>
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-crm-green" /><span className="text-xs text-muted-foreground">Online</span></div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
              {messages.length === 0 && <div className="text-center text-muted-foreground text-sm mt-16">Start the conversation by sending a message</div>}
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div>
                    <div className={`px-3.5 py-2.5 text-sm max-w-[360px] ${msg.sender === "user" ? "bg-crm-blue text-primary-foreground rounded-2xl rounded-br-sm" : "bg-card border border-border text-foreground rounded-2xl rounded-bl-sm"}`}>
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
              <input className="flex-1 border border-border rounded-lg px-4 py-2.5 text-sm bg-background focus:ring-2 focus:ring-crm-blue/20 focus:border-crm-blue transition-all" placeholder="Type message..." value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendMessage()} />
              <button onClick={sendMessage} disabled={!input.trim()} className="w-10 h-10 rounded-full bg-crm-blue flex items-center justify-center hover:bg-crm-blue-dark transition-colors disabled:opacity-50">
                <Send size={16} className="text-primary-foreground" />
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center flex-col gap-3">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <Send size={24} className="text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-sm">Select or create a conversation</p>
          </div>
        )}
      </div>

      {/* Right Panel - Contact Details */}
      {activeConv && (
        <div className="w-[240px] bg-card border-l border-border p-4 flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <button className="text-sm font-medium text-crm-blue border-b-2 border-crm-blue pb-1">Details</button>
          </div>
          <div className="flex flex-col items-center mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-crm-blue/20 to-indigo-500/20 mb-3 flex items-center justify-center text-xl font-bold text-crm-blue">
              {activeConv.contact_name?.[0]?.toUpperCase()}
            </div>
            <span className="font-semibold text-sm text-foreground">{activeConv.contact_name}</span>
          </div>
          {contactInfo && (
            <div className="space-y-3 border-t border-border pt-4">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Contact Info</h3>
              {contactInfo.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone size={14} className="text-muted-foreground" />
                  <span className="text-foreground">{contactInfo.phone}</span>
                </div>
              )}
              {contactInfo.email && (
                <div className="flex items-center gap-2 text-sm">
                  <Mail size={14} className="text-muted-foreground" />
                  <span className="text-foreground text-xs">{contactInfo.email}</span>
                </div>
              )}
            </div>
          )}
          {!contactInfo && activeConv.contact_id && (
            <p className="text-xs text-muted-foreground text-center">Loading contact info...</p>
          )}
          {!activeConv.contact_id && (
            <p className="text-xs text-muted-foreground text-center border-t border-border pt-4">No linked contact</p>
          )}
        </div>
      )}

      {showNew && (
        <Modal title="New Conversation" onClose={() => { setShowNew(false); setNewName(""); setSelectedContactId(""); }}>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Link to Contact (Optional)</label>
              <select className="border border-border rounded-lg px-4 py-2.5 text-sm w-full bg-background" value={selectedContactId} onChange={(e) => {
                setSelectedContactId(e.target.value);
                const c = contacts.find(c => c.id === e.target.value);
                if (c) setNewName(c.name);
              }}>
                <option value="">-- Select Contact --</option>
                {contacts.map(c => <option key={c.id} value={c.id}>{c.name} {c.phone ? `(${c.phone})` : ""}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Contact Name *</label>
              <input className="border border-border rounded-lg px-4 py-2.5 text-sm w-full bg-background" placeholder="Contact Name" value={newName} onChange={(e) => setNewName(e.target.value)} />
            </div>
            <div className="flex justify-end">
              <button onClick={createConversation} disabled={!newName.trim()} className="bg-crm-blue text-primary-foreground px-5 py-2 rounded-lg text-sm font-medium hover:bg-crm-blue-dark disabled:opacity-50">Create</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Inbox;
