import { useLocation, useNavigate } from "react-router-dom";
import { Search, LayoutDashboard, Users, Globe, Mail, Share2, Settings, Newspaper, Eye, MessageCircle, ShoppingCart, LogOut, ChevronRight, Bot } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  const isActive = (path: string) => location.pathname.startsWith(path);

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  const NavItem = ({ icon: Icon, label, path, hasArrow }: { icon: any; label: string; path: string; hasArrow?: boolean }) => (
    <button
      onClick={() => navigate(path)}
      className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors rounded-lg ${
        isActive(path)
          ? "bg-primary-foreground/20 text-primary-foreground font-medium"
          : "text-primary-foreground/80 hover:bg-primary-foreground/10"
      }`}
    >
      <span className="flex items-center gap-3">
        {Icon && <Icon size={18} />}
        {!Icon && <span className="w-[18px]" />}
        {label}
      </span>
      {hasArrow && <ChevronRight size={14} className="opacity-60" />}
    </button>
  );

  const SectionLabel = ({ label }: { label: string }) => (
    <div className="px-4 pt-5 pb-1.5 text-[10px] font-semibold tracking-wider text-primary-foreground/50 uppercase">
      {label}
    </div>
  );

  return (
    <div className="fixed left-0 top-0 h-screen w-[240px] bg-crm-blue flex flex-col z-50">
      <div className="px-5 pt-5 pb-4">
        <div className="flex items-center gap-2">
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
            <path d="M16 4L6 10v12l10 6 10-6V10L16 4z" fill="white" fillOpacity="0.9"/>
            <circle cx="12" cy="14" r="2.5" fill="hsl(229,69%,55%)"/>
            <circle cx="20" cy="14" r="2.5" fill="hsl(229,69%,55%)"/>
          </svg>
          <span className="font-bold text-base text-primary-foreground tracking-tight">LeadBug OMT</span>
        </div>
      </div>

      <div className="px-4 pb-2">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-foreground/50" />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-primary-foreground/15 text-primary-foreground placeholder:text-primary-foreground/40 text-sm rounded-full pl-9 pr-3 py-2 outline-none focus:bg-primary-foreground/20 transition-colors"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar px-2">
        <SectionLabel label="Database" />
        <NavItem icon={LayoutDashboard} label="Dashboard" path="/dashboard" />
        <NavItem icon={Users} label="Contacts" path="/contacts" />
        <NavItem icon={Globe} label="Sequences" path="/sequences" />

        <SectionLabel label="Control Panel" />
        <NavItem icon={Mail} label="Inbox" path="/inbox" hasArrow />
        <NavItem icon={Bot} label="AI Chatbot" path="/chatbot" hasArrow />

        <SectionLabel label="WhatsApp" />
        <NavItem icon={MessageCircle} label="Templates" path="/templates" hasArrow />
        <NavItem icon={Share2} label="Create Template" path="/templates/new" />
        <NavItem icon={Newspaper} label="New Sequence" path="/sequences/new" />

        <SectionLabel label="Account" />
        <NavItem icon={Settings} label="Settings" path="/settings" hasArrow />
      </div>

      {/* User + Logout */}
      <div className="px-4 pb-5 border-t border-primary-foreground/15 pt-3">
        <div className="text-xs text-primary-foreground/60 mb-2 truncate">{user?.email}</div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10 rounded-lg transition-colors"
        >
          <LogOut size={18} />
          Log out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
