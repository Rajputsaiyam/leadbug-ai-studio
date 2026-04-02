import { useNavigate } from "react-router-dom";
import { MessageSquare, Heart, List, User } from "lucide-react";
import StatusBadge from "@/components/shared/StatusBadge";

const setupCards = [
  { icon: MessageSquare, iconBg: "bg-[#25D366]", title: "Connect Number", badge: "Pending", btn: "Connect" },
  { icon: Heart, iconBg: "bg-crm-red", title: "Greeting Flow", badge: "Pending", btn: "Edit Flow" },
  { icon: List, iconBg: "bg-muted", title: "FAQ Auto-replies", badge: "Pending", btn: "Edit" },
];

const objectiveCards = [
  { title: "Generate High-intent Leads", sub: "Via Click to WhatsApp Ads" },
  { title: "Automate Regular Follow-ups on Leads", sub: "Via WhatsApp Automated Notifications" },
  { title: "Qualify Ad Leads", sub: "Via WhatsApp Forms" },
];

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div>
      {/* Setup Status */}
      <div className="grid grid-cols-3 gap-4">
        {setupCards.map((card) => (
          <div key={card.title} className="bg-card rounded-xl p-4 border border-crm-border flex items-center gap-3">
            <div className={`w-9 h-9 rounded-lg ${card.iconBg} flex items-center justify-center`}>
              <card.icon size={18} className="text-primary-foreground" />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-sm text-foreground">{card.title}</div>
              <StatusBadge status={card.badge} />
            </div>
            <button className="text-xs border border-crm-border rounded-lg px-3 py-1.5 text-foreground hover:bg-muted transition-colors">
              {card.btn}
            </button>
          </div>
        ))}
      </div>

      {/* Update Profile */}
      <div className="mt-4 bg-card rounded-xl p-4 border border-crm-border flex items-center gap-3 max-w-[50%]">
        <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center">
          <User size={18} className="text-muted-foreground" />
        </div>
        <div className="flex-1">
          <div className="font-semibold text-sm text-foreground">Update WhatsApp Profile</div>
          <div className="text-xs text-muted-foreground">Make a great first impression</div>
        </div>
        <button className="text-xs text-muted-foreground hover:text-foreground">Update</button>
      </div>

      {/* Objectives */}
      <h2 className="text-lg font-semibold text-foreground mt-7 mb-4">Objectives</h2>
      <div className="grid grid-cols-3 gap-4">
        {objectiveCards.map((obj) => (
          <div key={obj.title} className="bg-card rounded-xl p-5 border border-crm-border">
            <h3 className="font-semibold text-sm text-foreground">{obj.title}</h3>
            <p className="text-xs text-muted-foreground mt-2 mb-4">{obj.sub}</p>
            <button
              onClick={() => navigate("/sequences/new")}
              className="text-xs border border-crm-border rounded-lg px-3 py-1.5 text-foreground hover:bg-muted transition-colors"
            >
              Setup
            </button>
          </div>
        ))}
      </div>
      <div className="text-center mt-4">
        <button className="text-crm-blue text-sm hover:underline">View All ∨</button>
      </div>
    </div>
  );
};

export default Dashboard;
