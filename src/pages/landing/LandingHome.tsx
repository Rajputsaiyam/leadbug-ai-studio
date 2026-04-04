import { useNavigate } from "react-router-dom";
import { MessageCircle, Zap, Users, BarChart3, ArrowRight, CheckCircle, Star } from "lucide-react";

const LandingHome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-card/80 backdrop-blur-md border-b border-border z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-crm-blue rounded-lg flex items-center justify-center">
              <MessageCircle size={18} className="text-primary-foreground" />
            </div>
            <span className="font-bold text-lg text-foreground">LeadBug</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <button onClick={() => navigate("/landing/features")} className="hover:text-foreground transition-colors">Features</button>
            <button onClick={() => navigate("/landing/pricing")} className="hover:text-foreground transition-colors">Pricing</button>
            <button className="hover:text-foreground transition-colors">Docs</button>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/onboarding")} className="text-sm text-crm-blue hover:underline">Log in</button>
            <button onClick={() => navigate("/onboarding")} className="bg-crm-blue text-primary-foreground text-sm px-5 py-2 rounded-full hover:bg-crm-blue-dark transition-colors">
              Get Started Free
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-crm-blue-light text-crm-blue text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
            <Zap size={14} /> Powered by AI & WhatsApp Business API
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-foreground leading-tight tracking-tight">
            Turn WhatsApp into your
            <span className="text-crm-blue"> #1 Sales Channel</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Automate campaigns, nurture leads with AI chatbots, and close deals faster — all from one powerful WhatsApp CRM platform.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={() => navigate("/onboarding")} className="bg-crm-blue text-primary-foreground px-8 py-3.5 rounded-full text-base font-semibold hover:bg-crm-blue-dark transition-colors flex items-center gap-2 shadow-lg shadow-crm-blue/25">
              Start Free Trial <ArrowRight size={18} />
            </button>
            <button onClick={() => navigate("/landing/features")} className="border border-border text-foreground px-8 py-3.5 rounded-full text-base font-medium hover:bg-muted transition-colors">
              See Features
            </button>
          </div>
          <div className="mt-8 flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5"><CheckCircle size={14} className="text-crm-green" /> No credit card</span>
            <span className="flex items-center gap-1.5"><CheckCircle size={14} className="text-crm-green" /> 14-day free trial</span>
            <span className="flex items-center gap-1.5"><CheckCircle size={14} className="text-crm-green" /> Cancel anytime</span>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 border-y border-border bg-card">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 px-6 text-center">
          {[
            { value: "10K+", label: "Active Users" },
            { value: "50M+", label: "Messages Sent" },
            { value: "98%", label: "Delivery Rate" },
            { value: "4.9", label: "User Rating", icon: Star },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-3xl font-extrabold text-foreground flex items-center justify-center gap-1">
                {s.value} {s.icon && <s.icon size={20} className="text-crm-amber fill-crm-amber" />}
              </div>
              <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground text-center">Everything you need to scale on WhatsApp</h2>
          <p className="text-muted-foreground text-center mt-3 mb-14 max-w-xl mx-auto">From lead generation to customer support, LeadBug handles it all.</p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: MessageCircle, title: "Bulk Campaigns", desc: "Send personalized broadcasts to thousands of contacts with smart scheduling and analytics." },
              { icon: Zap, title: "AI Chatbot", desc: "24/7 automated responses powered by AI. Handle FAQs, qualify leads, and escalate to humans." },
              { icon: Users, title: "Contact Management", desc: "Organize, tag, and segment your contacts. Import from CSV or sync with your existing CRM." },
              { icon: BarChart3, title: "Analytics Dashboard", desc: "Track delivery rates, open rates, click-through rates, and conversion metrics in real-time." },
              { icon: Zap, title: "Sequence Automation", desc: "Build multi-step drip campaigns that nurture leads automatically over days or weeks." },
              { icon: Star, title: "Template Builder", desc: "Create Meta-approved message templates with AI assistance. Preview before sending." },
            ].map((f) => (
              <div key={f.title} className="bg-card border border-border rounded-xl p-6 hover:shadow-lg hover:border-crm-blue/30 transition-all group">
                <div className="w-11 h-11 rounded-xl bg-crm-blue-light flex items-center justify-center mb-4 group-hover:bg-crm-blue transition-colors">
                  <f.icon size={20} className="text-crm-blue group-hover:text-primary-foreground transition-colors" />
                </div>
                <h3 className="font-semibold text-foreground text-base">{f.title}</h3>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto bg-crm-blue rounded-2xl p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-crm-blue via-crm-blue to-crm-blue-dark" />
          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-primary-foreground">Ready to supercharge your WhatsApp sales?</h2>
            <p className="text-primary-foreground/80 mt-4 max-w-lg mx-auto">Join 10,000+ businesses using LeadBug to grow revenue through WhatsApp.</p>
            <button onClick={() => navigate("/onboarding")} className="mt-8 bg-primary-foreground text-crm-blue px-8 py-3.5 rounded-full font-semibold hover:bg-primary-foreground/90 transition-colors inline-flex items-center gap-2">
              Get Started Now <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <span>© 2026 LeadBug. All rights reserved.</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="hover:text-foreground transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingHome;
