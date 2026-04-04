import { useNavigate } from "react-router-dom";
import { MessageSquare, Heart, List, User } from "lucide-react";
import StatusBadge from "@/components/shared/StatusBadge";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState({ templates: 0, sequences: 0, contacts: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const [t, s, c] = await Promise.all([
        supabase.from("templates").select("id", { count: "exact", head: true }),
        supabase.from("sequences").select("id", { count: "exact", head: true }),
        supabase.from("contacts").select("id", { count: "exact", head: true }),
      ]);
      setStats({
        templates: t.count || 0,
        sequences: s.count || 0,
        contacts: c.count || 0,
      });
    };
    fetchStats();
  }, []);

  const setupCards = [
    { icon: MessageSquare, iconBg: "bg-[#25D366]", title: "Connect Number", badge: "Pending", btn: "Connect", action: () => navigate("/onboarding") },
    { icon: Heart, iconBg: "bg-destructive", title: "Greeting Flow", badge: "Pending", btn: "Edit Flow", action: () => navigate("/templates/new") },
    { icon: List, iconBg: "bg-muted", title: "FAQ Auto-replies", badge: "Pending", btn: "Edit", action: () => navigate("/chatbot") },
  ];

  const objectiveCards = [
    { title: "Generate High-intent Leads", sub: "Via Click to WhatsApp Ads", action: () => navigate("/sequences/new") },
    { title: "Automate Regular Follow-ups", sub: "Via WhatsApp Automated Notifications", action: () => navigate("/sequences/new") },
    { title: "Qualify Ad Leads", sub: "Via WhatsApp Forms", action: () => navigate("/templates/new") },
  ];

  return (
    <div>
      {/* Welcome */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-foreground">Welcome back{user?.user_metadata?.full_name ? `, ${user.user_metadata.full_name}` : ""}! 👋</h1>
        <p className="text-sm text-muted-foreground mt-1">Here's an overview of your WhatsApp CRM</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Templates", count: stats.templates, color: "text-crm-blue" },
          { label: "Sequences", count: stats.sequences, color: "text-crm-green" },
          { label: "Contacts", count: stats.contacts, color: "text-crm-amber" },
        ].map(s => (
          <div key={s.label} className="bg-card rounded-xl border border-border p-5">
            <div className={`text-3xl font-bold ${s.color}`}>{s.count}</div>
            <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Setup Status */}
      <div className="grid grid-cols-3 gap-4">
        {setupCards.map((card) => (
          <div key={card.title} className="bg-card rounded-xl p-4 border border-border flex items-center gap-3">
            <div className={`w-9 h-9 rounded-lg ${card.iconBg} flex items-center justify-center`}>
              <card.icon size={18} className="text-primary-foreground" />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-sm text-foreground">{card.title}</div>
              <StatusBadge status={card.badge} />
            </div>
            <button onClick={card.action} className="text-xs border border-border rounded-lg px-3 py-1.5 text-foreground hover:bg-muted transition-colors">
              {card.btn}
            </button>
          </div>
        ))}
      </div>

      {/* Update Profile */}
      <div className="mt-4 bg-card rounded-xl p-4 border border-border flex items-center gap-3 max-w-[50%]">
        <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center">
          <User size={18} className="text-muted-foreground" />
        </div>
        <div className="flex-1">
          <div className="font-semibold text-sm text-foreground">Update WhatsApp Profile</div>
          <div className="text-xs text-muted-foreground">Make a great first impression</div>
        </div>
        <button onClick={() => navigate("/settings")} className="text-xs text-muted-foreground hover:text-foreground">Update</button>
      </div>

      {/* Objectives */}
      <h2 className="text-lg font-semibold text-foreground mt-7 mb-4">Objectives</h2>
      <div className="grid grid-cols-3 gap-4">
        {objectiveCards.map((obj) => (
          <div key={obj.title} className="bg-card rounded-xl p-5 border border-border">
            <h3 className="font-semibold text-sm text-foreground">{obj.title}</h3>
            <p className="text-xs text-muted-foreground mt-2 mb-4">{obj.sub}</p>
            <button onClick={obj.action} className="text-xs border border-border rounded-lg px-3 py-1.5 text-foreground hover:bg-muted transition-colors">Setup</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
