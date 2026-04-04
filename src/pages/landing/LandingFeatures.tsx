import { useNavigate } from "react-router-dom";
import { MessageCircle, Zap, Users, BarChart3, Bot, Layers, FileText, Shield, Globe, ArrowRight } from "lucide-react";

const features = [
  {
    icon: MessageCircle,
    title: "Bulk WhatsApp Campaigns",
    desc: "Reach thousands of contacts instantly with personalized messages. Smart scheduling ensures optimal delivery times across time zones.",
    highlights: ["Personalized variables", "Smart scheduling", "Delivery tracking"],
  },
  {
    icon: Bot,
    title: "AI-Powered Chatbot",
    desc: "Deploy intelligent chatbots that understand context, answer FAQs, qualify leads, and seamlessly escalate to human agents when needed.",
    highlights: ["Natural language", "Lead qualification", "Human handoff"],
  },
  {
    icon: Layers,
    title: "Drip Sequences",
    desc: "Build automated multi-step follow-up sequences. Nurture leads over days or weeks with perfectly timed messages.",
    highlights: ["Multi-step flows", "Conditional logic", "A/B testing"],
  },
  {
    icon: FileText,
    title: "Template Builder with AI",
    desc: "Create Meta-approved message templates effortlessly. Our AI generates professional copy based on your campaign goals.",
    highlights: ["AI generation", "Live preview", "Meta approval"],
  },
  {
    icon: Users,
    title: "Contact Hub",
    desc: "Centralized contact management with tags, segments, and custom fields. Import from CSV or sync with external CRMs.",
    highlights: ["Smart segments", "CSV import", "Custom fields"],
  },
  {
    icon: BarChart3,
    title: "Real-Time Analytics",
    desc: "Monitor campaign performance with live dashboards. Track delivery, open rates, click-throughs, and conversions.",
    highlights: ["Live metrics", "Export reports", "Funnel analysis"],
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    desc: "End-to-end encryption, role-based access control, and full compliance with WhatsApp Business API policies.",
    highlights: ["E2E encryption", "RBAC", "Audit logs"],
  },
  {
    icon: Globe,
    title: "Multi-Language Support",
    desc: "Create templates in 60+ languages. Automatically detect contact language preferences for localized messaging.",
    highlights: ["60+ languages", "Auto-detect", "RTL support"],
  },
];

const LandingFeatures = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-card/80 backdrop-blur-md border-b border-border z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 h-16">
          <button onClick={() => navigate("/landing")} className="flex items-center gap-2">
            <div className="w-8 h-8 bg-crm-blue rounded-lg flex items-center justify-center">
              <MessageCircle size={18} className="text-primary-foreground" />
            </div>
            <span className="font-bold text-lg text-foreground">LeadBug</span>
          </button>
          <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <button onClick={() => navigate("/landing")} className="hover:text-foreground transition-colors">Home</button>
            <span className="text-foreground font-medium">Features</span>
            <button onClick={() => navigate("/landing/pricing")} className="hover:text-foreground transition-colors">Pricing</button>
          </div>
          <button onClick={() => navigate("/onboarding")} className="bg-crm-blue text-primary-foreground text-sm px-5 py-2 rounded-full hover:bg-crm-blue-dark transition-colors">
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-16 px-6 text-center">
        <div className="inline-flex items-center gap-2 bg-crm-blue-light text-crm-blue text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
          <Zap size={14} /> Platform Features
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-foreground max-w-3xl mx-auto leading-tight">
          Powerful features to grow your business on WhatsApp
        </h1>
        <p className="text-lg text-muted-foreground mt-5 max-w-2xl mx-auto">
          From AI chatbots to bulk campaigns — every tool you need in one integrated platform.
        </p>
      </section>

      {/* Features */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6">
          {features.map((f, i) => (
            <div key={f.title} className="bg-card border border-border rounded-xl p-8 hover:shadow-xl hover:border-crm-blue/20 transition-all group">
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 rounded-xl bg-crm-blue-light flex items-center justify-center shrink-0 group-hover:bg-crm-blue transition-colors">
                  <f.icon size={22} className="text-crm-blue group-hover:text-primary-foreground transition-colors" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-lg">{f.title}</h3>
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{f.desc}</p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {f.highlights.map((h) => (
                      <span key={h} className="text-xs bg-muted text-muted-foreground px-2.5 py-1 rounded-full">{h}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-foreground">Ready to get started?</h2>
          <p className="text-muted-foreground mt-3">Start your 14-day free trial. No credit card required.</p>
          <button onClick={() => navigate("/onboarding")} className="mt-8 bg-crm-blue text-primary-foreground px-8 py-3.5 rounded-full font-semibold hover:bg-crm-blue-dark transition-colors inline-flex items-center gap-2">
            Start Free Trial <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <span>© 2026 LeadBug. All rights reserved.</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingFeatures;
