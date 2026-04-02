import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Info, CheckCircle, XCircle } from "lucide-react";

const industries = [
  "Marketing & Advertising", "Retail", "Education", "Finance",
  "Entertainment, Social Media & Gaming", "Healthcare", "Technology",
  "Professional Services", "Public Utilities & Non-Profits", "Automotive",
];

const objectives = [
  { title: "Generate High-intent Leads", sub: "Click to WhatsApp Ads" },
  { title: "Quality Ad Leads", sub: "WhatsApp Forms" },
  { title: "Re-target Qualified Leads in Bulk", sub: "WhatsApp Bulk Campaigns" },
  { title: "Automate Regular Follow-ups on Leads", sub: "WhatsApp Automated Notification" },
  { title: "Others Reasons", sub: "If you wish to do Something Else" },
];

const OnboardingWizard = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    fullName: "", email: "", phone: "", company: "", employees: "", revenue: "",
    industry: "", subCategory: "",
    objectives: [] as string[],
    otp: "",
  });

  const update = (key: string, val: string) => setForm((p) => ({ ...p, [key]: val }));

  const toggleObjective = (title: string) => {
    setForm((p) => {
      if (p.objectives.includes(title)) return { ...p, objectives: p.objectives.filter((o) => o !== title) };
      if (p.objectives.length >= 3) return p;
      return { ...p, objectives: [...p.objectives, title] };
    });
  };

  return (
    <div className="flex h-screen">
      {/* Left Panel */}
      <div className="w-[55%] bg-card p-12 overflow-y-auto">
        <div className="flex items-center gap-2 mb-10">
          <div className="w-7 h-7 bg-crm-blue rounded-md flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="white"/>
            </svg>
          </div>
          <span className="font-bold text-sm text-foreground">LeadBug</span>
        </div>

        {step === 1 && (
          <div>
            <h2 className="text-[28px] font-bold text-foreground">Business Details Capture</h2>
            <div className="flex flex-col gap-3 mt-6">
              <input className="border border-crm-border rounded-lg px-4 py-2.5 text-sm" placeholder="Full Name" value={form.fullName} onChange={(e) => update("fullName", e.target.value)} />
              <input className="border border-crm-border rounded-lg px-4 py-2.5 text-sm" type="email" placeholder="Business Email" value={form.email} onChange={(e) => update("email", e.target.value)} />
              <div className="flex gap-2">
                <select className="border border-crm-border rounded-lg px-3 py-2.5 text-sm w-20">
                  <option>+91</option><option>+1</option><option>+44</option>
                </select>
                <input className="border border-crm-border rounded-lg px-4 py-2.5 text-sm flex-1" placeholder="WhatsApp Number" value={form.phone} onChange={(e) => update("phone", e.target.value)} />
              </div>
              <input className="border border-crm-border rounded-lg px-4 py-2.5 text-sm" placeholder="Company Name" value={form.company} onChange={(e) => update("company", e.target.value)} />
              <select className="border border-crm-border rounded-lg px-4 py-2.5 text-sm" value={form.employees} onChange={(e) => update("employees", e.target.value)}>
                <option value="">Number of Employees</option>
                <option>1-10</option><option>11-50</option><option>51-200</option><option>201-500</option><option>500+</option>
              </select>
              <select className="border border-crm-border rounded-lg px-4 py-2.5 text-sm" value={form.revenue} onChange={(e) => update("revenue", e.target.value)}>
                <option value="">Annual Revenue</option>
                <option>&lt;10L</option><option>10L-50L</option><option>50L-1Cr</option><option>1Cr+</option>
              </select>
            </div>
            <div className="flex justify-end mt-6">
              <button onClick={() => setStep(2)} className="bg-crm-blue text-primary-foreground px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-crm-blue-dark transition-colors">Continue</button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-[28px] font-bold text-foreground">Which Industry does your business belong to?</h2>
            <p className="text-sm text-muted-foreground mt-1">We'll accordingly personalizes your experiences</p>
            <div className="flex flex-wrap gap-2 mt-6">
              {industries.map((ind) => (
                <button
                  key={ind}
                  onClick={() => update("industry", ind)}
                  className={`px-3.5 py-1.5 rounded-full text-sm border transition-colors ${
                    form.industry === ind
                      ? "bg-crm-blue text-primary-foreground border-crm-blue"
                      : "border-crm-border text-foreground hover:border-crm-blue"
                  }`}
                >
                  {ind}
                </button>
              ))}
            </div>
            <select className="border border-crm-border rounded-lg px-4 py-2.5 text-sm w-full mt-3" value={form.subCategory} onChange={(e) => update("subCategory", e.target.value)}>
              <option value="">Sub-Category</option>
              <option>Digital Marketing</option><option>Content Marketing</option><option>SEO</option>
            </select>
            <div className="flex justify-end mt-6">
              <button onClick={() => setStep(3)} className="bg-crm-blue text-primary-foreground px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-crm-blue-dark transition-colors">Next</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-[28px] font-bold text-foreground">What would you like to use Leadbug for?</h2>
            <p className="text-sm text-muted-foreground mt-1">Choose up to 3 Objectives & we will help you achieve these super quick!</p>
            <div className="mt-6">
              {objectives.map((obj) => (
                <div key={obj.title} className="flex items-center justify-between py-3.5 border-b border-crm-border">
                  <div>
                    <div className="font-semibold text-sm text-foreground">{obj.title}</div>
                    <div className="text-xs text-muted-foreground">{obj.sub}</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={form.objectives.includes(obj.title)}
                    onChange={() => toggleObjective(obj.title)}
                    className="w-4 h-4 accent-crm-blue"
                  />
                </div>
              ))}
            </div>
            {form.objectives.length >= 3 && <p className="text-xs text-crm-amber mt-2">Maximum 3 objectives allowed</p>}
            <div className="flex justify-end mt-6">
              <button onClick={() => setStep(4)} className="bg-crm-blue text-primary-foreground px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-crm-blue-dark transition-colors">Next</button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <h2 className="text-[28px] font-bold text-foreground">Number Entry & Validation</h2>
            <div className="flex flex-col gap-3 mt-6">
              <div className="flex gap-2">
                <select className="border border-crm-border rounded-lg px-3 py-2.5 text-sm w-20">
                  <option>+91</option><option>+1</option><option>+44</option>
                </select>
                <input className="border border-crm-border rounded-lg px-4 py-2.5 text-sm flex-1" placeholder="WhatsApp Number" value={form.phone} onChange={(e) => update("phone", e.target.value)} />
              </div>
              <input className="border border-crm-border rounded-lg px-4 py-2.5 text-sm" placeholder="OTP" value={form.otp} onChange={(e) => update("otp", e.target.value)} />
              <div className="flex justify-end">
                <button className="text-crm-blue text-[13px] hover:underline">Resend OTP</button>
              </div>
            </div>
            <div className="flex flex-col gap-3 mt-4">
              <div className="flex items-center gap-2"><Info size={16} className="text-crm-blue" /><span className="text-sm text-muted-foreground">Enter the OTP sent to your WhatsApp number</span></div>
              <div className="flex items-center gap-2"><CheckCircle size={16} className="text-crm-green" /><span className="text-sm text-muted-foreground">Your number will be verified instantly</span></div>
              <div className="flex items-center gap-2"><XCircle size={16} className="text-crm-red" /><span className="text-sm text-muted-foreground">Contact support if verification fails</span></div>
            </div>
            <button
              onClick={() => navigate("/dashboard")}
              className="w-full bg-crm-blue text-primary-foreground py-2.5 rounded-lg text-sm font-medium mt-6 hover:bg-crm-blue-dark transition-colors"
            >
              Check & Continue
            </button>
          </div>
        )}
      </div>

      {/* Right Panel */}
      <div className="w-[45%] bg-crm-blue flex flex-col items-center justify-center relative">
        <div className="w-64 h-48 flex items-center justify-center">
          <svg width="200" height="150" viewBox="0 0 200 150">
            <rect x="20" y="30" width="160" height="90" rx="12" fill="white" fillOpacity="0.15"/>
            <rect x="40" y="50" width="80" height="10" rx="5" fill="white" fillOpacity="0.3"/>
            <rect x="40" y="70" width="60" height="10" rx="5" fill="white" fillOpacity="0.2"/>
            <circle cx="150" cy="75" r="25" fill="white" fillOpacity="0.2"/>
            <path d="M142 75l6 6 12-12" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
          </svg>
        </div>
        <p className="text-primary-foreground/80 text-sm absolute bottom-8">Step {step} of 4</p>
      </div>
    </div>
  );
};

export default OnboardingWizard;
