import { useNavigate, useLocation } from "react-router-dom";
import { Bell } from "lucide-react";

const navTabs = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "Tutorial", path: "#" },
  { label: "Help", path: "#" },
  { label: "Billing & Payments", path: "#" },
];

const TopNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="fixed top-0 left-[60px] right-0 h-[56px] bg-card border-b border-crm-border flex items-center px-4 z-40">
      {/* Logo */}
      <div className="flex items-center gap-2 min-w-[180px]">
        <div className="w-7 h-7 bg-crm-blue rounded-md flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="white"/>
          </svg>
        </div>
        <span className="font-bold text-sm text-foreground">LeadBug CRM</span>
      </div>

      {/* Center Nav Tabs */}
      <div className="flex-1 flex justify-center">
        <div className="bg-crm-blue rounded-full flex items-center px-1 py-1 gap-0.5">
          {navTabs.map((tab) => {
            const isActive = location.pathname === tab.path;
            return (
              <button
                key={tab.label}
                onClick={() => tab.path !== "#" && navigate(tab.path)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  isActive
                    ? "bg-primary-foreground text-crm-blue"
                    : "text-primary-foreground hover:bg-primary-foreground/15"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3 min-w-[320px] justify-end">
        <span className="text-xs text-muted-foreground">Available Credits: 0</span>
        <button className="text-xs border border-crm-border rounded-full px-3 py-1.5 text-foreground hover:bg-muted transition-colors">
          My Profile
        </button>
        <button className="text-xs text-crm-blue hover:underline">Refer and Earn</button>
        <button className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors">
          <Bell size={16} className="text-muted-foreground" />
        </button>
      </div>
    </div>
  );
};

export default TopNav;
