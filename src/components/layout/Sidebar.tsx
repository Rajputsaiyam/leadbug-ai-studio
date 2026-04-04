import { useLocation, useNavigate } from "react-router-dom";
import { Search, LayoutDashboard, Users, Globe, Mail, Share2, Settings, Newspaper, Eye, MessageCircle, ShoppingCart, LogOut, ChevronRight } from "lucide-react";
import { useState } from "react";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const isActive = (path: string) => location.pathname.startsWith(path);

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
      {/* Brand */}
      <div className="px-5 pt-5 pb-4">
        <div className="flex items-center gap-2">
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
            <path d="M16 4L6 10v12l10 6 10-6V10L16 4z" fill="white" fillOpacity="0.9"/>
            <circle cx="12" cy="14" r="2.5" fill="hsl(229,69%,55%)"/>
            <circle cx="20" cy="14" r="2.5" fill="hsl(229,69%,55%)"/>
            <path d="M16 28L6 22V10" stroke="white" strokeWidth="0.5" fillOpacity="0.3"/>
          </svg>
          <span className="font-bold text-base text-primary-foreground tracking-tight">LeadBug OMT</span>
        </div>
      </div>

      {/* Search */}
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

      {/* Nav */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-2">
        <SectionLabel label="Database" />
        <NavItem icon={LayoutDashboard} label="Dashboard" path="/dashboard" />
        <NavItem icon={Users} label="People's Data" path="/contacts" />
        <NavItem icon={Globe} label="Google Leads" path="/leads" />

        <SectionLabel label="Control Panel" />
        <NavItem icon={Mail} label="Email CRM" path="/inbox" hasArrow />
        <NavItem icon={Share2} label="Media Connect" path="/media" hasArrow />

        <SectionLabel label="Account Settings" />
        <NavItem icon={Settings} label="Account Settings" path="/settings" hasArrow />

        <div className="my-2 mx-4 border-t border-primary-foreground/15" />

        <NavItem icon={Newspaper} label="All Publishers Sites" path="/publishers" hasArrow />
        <NavItem icon={Eye} label="SEO" path="/seo" />
        <NavItem icon={MessageCircle} label="WhatsApp API" path="/templates" hasArrow />
        <NavItem icon={ShoppingCart} label="Shop" path="/shop" />
      </div>

      {/* Logout */}
      <div className="px-2 pb-5">
        <button
          onClick={() => navigate("/")}
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
