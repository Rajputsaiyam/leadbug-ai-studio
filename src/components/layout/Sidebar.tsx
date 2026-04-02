import { useLocation, useNavigate } from "react-router-dom";
import { Home, MessageSquare, FileText, Layers, User } from "lucide-react";

const navItems = [
  { icon: Home, path: "/dashboard", label: "Home" },
  { icon: MessageSquare, path: "/inbox", label: "Inbox" },
  { icon: FileText, path: "/templates", label: "Templates" },
  { icon: Layers, path: "/sequences", label: "Sequences" },
  { icon: User, path: "/contacts", label: "Contacts" },
];

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="fixed left-0 top-0 h-screen w-[60px] bg-crm-blue flex flex-col items-center py-4 z-50">
      {/* Logo */}
      <div className="w-9 h-9 bg-primary-foreground/20 rounded-lg flex items-center justify-center mb-8 cursor-pointer" onClick={() => navigate("/dashboard")}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="white"/>
        </svg>
      </div>

      {/* Nav Icons */}
      <div className="flex flex-col items-center gap-2 flex-1">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                isActive ? "bg-primary-foreground/25" : "hover:bg-primary-foreground/10"
              }`}
              title={item.label}
            >
              <item.icon size={20} className="text-primary-foreground" />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
