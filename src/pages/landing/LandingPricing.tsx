import { useNavigate } from "react-router-dom";
import { MessageCircle, Check, ArrowRight, Zap } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "₹999",
    period: "/month",
    desc: "Perfect for small businesses getting started with WhatsApp marketing.",
    features: [
      "1,000 messages/month",
      "1 WhatsApp number",
      "Basic templates",
      "Contact management",
      "Email support",
    ],
    cta: "Start Free Trial",
    popular: false,
  },
  {
    name: "Professional",
    price: "₹4,999",
    period: "/month",
    desc: "For growing businesses that need automation and AI features.",
    features: [
      "25,000 messages/month",
      "3 WhatsApp numbers",
      "AI template generator",
      "AI chatbot",
      "Drip sequences",
      "Advanced analytics",
      "Priority support",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    desc: "For large teams with advanced needs and dedicated support.",
    features: [
      "Unlimited messages",
      "Unlimited numbers",
      "Custom AI training",
      "API access",
      "Dedicated account manager",
      "SLA guarantee",
      "Custom integrations",
      "On-premise option",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

const LandingPricing = () => {
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
            <button onClick={() => navigate("/landing/features")} className="hover:text-foreground transition-colors">Features</button>
            <span className="text-foreground font-medium">Pricing</span>
          </div>
          <button onClick={() => navigate("/onboarding")} className="bg-crm-blue text-primary-foreground text-sm px-5 py-2 rounded-full hover:bg-crm-blue-dark transition-colors">
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-16 px-6 text-center">
        <div className="inline-flex items-center gap-2 bg-crm-blue-light text-crm-blue text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
          <Zap size={14} /> Simple, Transparent Pricing
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-foreground">
          Choose the right plan for your business
        </h1>
        <p className="text-lg text-muted-foreground mt-5 max-w-xl mx-auto">
          Start free, upgrade as you grow. All plans include a 14-day free trial.
        </p>
      </section>

      {/* Plans */}
      <section className="py-12 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-card rounded-2xl p-8 flex flex-col border-2 transition-all ${
                plan.popular
                  ? "border-crm-blue shadow-xl shadow-crm-blue/10 scale-[1.02]"
                  : "border-border hover:border-crm-blue/30 hover:shadow-lg"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-crm-blue text-primary-foreground text-xs font-semibold px-4 py-1 rounded-full">
                  Most Popular
                </div>
              )}
              <h3 className="font-bold text-lg text-foreground">{plan.name}</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-foreground">{plan.price}</span>
                <span className="text-muted-foreground text-sm">{plan.period}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-3">{plan.desc}</p>
              <div className="my-6 border-t border-border" />
              <ul className="flex-1 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-foreground">
                    <Check size={16} className="text-crm-green shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => navigate("/onboarding")}
                className={`mt-8 w-full py-3 rounded-full font-semibold text-sm transition-colors flex items-center justify-center gap-2 ${
                  plan.popular
                    ? "bg-crm-blue text-primary-foreground hover:bg-crm-blue-dark"
                    : "border-2 border-crm-blue text-crm-blue hover:bg-crm-blue hover:text-primary-foreground"
                }`}
              >
                {plan.cta} <ArrowRight size={16} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground text-center mb-10">Frequently Asked Questions</h2>
          {[
            { q: "Is there a free trial?", a: "Yes! All plans come with a 14-day free trial. No credit card required." },
            { q: "Can I change my plan later?", a: "Absolutely. Upgrade or downgrade at any time from your account settings." },
            { q: "Do I need a WhatsApp Business API account?", a: "LeadBug handles the setup for you. We'll guide you through connecting your business number during onboarding." },
            { q: "What payment methods do you accept?", a: "We accept all major credit/debit cards, UPI, and bank transfers for annual plans." },
          ].map((faq) => (
            <div key={faq.q} className="border-b border-border py-5">
              <h4 className="font-semibold text-foreground">{faq.q}</h4>
              <p className="text-sm text-muted-foreground mt-2">{faq.a}</p>
            </div>
          ))}
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

export default LandingPricing;
