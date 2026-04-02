import { Send, Paperclip, Mic, Phone, Mail, MapPin, Pencil } from "lucide-react";

const mockConversations = [
  { id: 1, name: "Kate Morrison", preview: "Thanks for reaching out!", time: "10:30 AM", unread: 1 },
];

const mockMessages = [
  { id: 1, type: "received" as const, text: "Hi! I'm interested in your services. Can you tell me more?", time: "10:25 AM" },
  { id: 2, type: "sent" as const, text: "Of course! We offer WhatsApp marketing solutions. What are you looking for specifically?", time: "10:28 AM" },
  { id: 3, type: "received" as const, text: "Thanks for reaching out!", time: "10:30 AM" },
];

const Inbox = () => {
  return (
    <div className="flex h-[calc(100vh-56px)] -m-6">
      {/* Left Panel - Conversations */}
      <div className="w-[220px] bg-card border-r border-crm-border flex flex-col">
        <div className="p-3 border-b border-crm-border flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">All 1 ▾</span>
          <div className="flex gap-2">
            <button className="text-muted-foreground hover:text-foreground">🔍</button>
            <button className="text-muted-foreground hover:text-foreground">≡</button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {mockConversations.map((conv) => (
            <div key={conv.id} className="p-3 bg-crm-blue-light border-b border-crm-border cursor-pointer flex gap-2">
              <div className="w-10 h-10 rounded-full bg-muted flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground truncate">{conv.name}</span>
                  <span className="text-[11px] text-muted-foreground">{conv.time}</span>
                </div>
                <p className="text-xs text-muted-foreground truncate">{conv.preview}</p>
              </div>
              {conv.unread > 0 && (
                <span className="w-5 h-5 rounded-full bg-crm-blue text-primary-foreground text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">{conv.unread}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Center Panel - Chat */}
      <div className="flex-1 flex flex-col bg-background">
        <div className="bg-card border-b border-crm-border p-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-muted" />
          <div>
            <span className="font-semibold text-sm text-foreground">Kate Morrison</span>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-crm-green" />
              <span className="text-xs text-muted-foreground">Online</span>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          {mockMessages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.type === "sent" ? "justify-end" : "justify-start"}`}>
              <div>
                <div className={`px-3.5 py-2.5 text-sm max-w-[320px] ${
                  msg.type === "sent"
                    ? "bg-crm-blue-light text-foreground rounded-xl rounded-br-sm"
                    : "bg-card border border-crm-border text-foreground rounded-xl rounded-bl-sm"
                }`}>
                  {msg.text}
                </div>
                <div className={`text-[11px] text-muted-foreground mt-1 ${msg.type === "sent" ? "text-right" : ""}`}>
                  {msg.time} · Viewed
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-card border-t border-crm-border p-3 flex items-center gap-3">
          <button className="text-muted-foreground hover:text-foreground"><Paperclip size={18} /></button>
          <button className="text-muted-foreground hover:text-foreground"><Mic size={18} /></button>
          <input className="flex-1 border border-crm-border rounded-lg px-4 py-2 text-sm" placeholder="Type message..." />
          <button className="w-9 h-9 rounded-full bg-crm-blue flex items-center justify-center hover:bg-crm-blue-dark transition-colors">
            <Send size={16} className="text-primary-foreground" />
          </button>
        </div>
      </div>

      {/* Right Panel - Contact Details */}
      <div className="w-[220px] bg-card border-l border-crm-border p-4">
        <div className="flex items-center gap-2 mb-4">
          <button className="text-sm font-medium text-crm-blue border-b-2 border-crm-blue pb-1">Details</button>
          <button className="text-sm text-muted-foreground pb-1">Activity</button>
        </div>
        <div className="flex items-center gap-1 mb-4">
          <span className="font-semibold text-sm text-foreground">CNTC: 20581</span>
          <Pencil size={12} className="text-muted-foreground" />
        </div>
        <div className="flex flex-col items-center mb-4">
          <div className="w-16 h-16 rounded-full bg-muted mb-2" />
          <span className="font-semibold text-sm text-foreground">Kate Morrison</span>
        </div>
        <div className="space-y-2 text-[13px] text-muted-foreground">
          <div className="flex items-center gap-2"><Phone size={14} /> +116355204421</div>
          <div className="flex items-center gap-2"><Mail size={14} /> demo@gmail.com</div>
          <div className="flex items-center gap-2"><MapPin size={14} /> Lafayette, California</div>
        </div>
      </div>
    </div>
  );
};

export default Inbox;
