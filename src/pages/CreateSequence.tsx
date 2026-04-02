import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, RefreshCw, Sparkles, Trash2 } from "lucide-react";
import StepBar from "@/components/shared/StepBar";
import ToggleSwitch from "@/components/shared/ToggleSwitch";
import Modal from "@/components/shared/Modal";
import api from "@/services/api";

const steps = ["Details", "Template", "Recipients", "Schedule"];

interface SeqStep {
  templateName: string;
  day: number;
  sendTime: string;
  timezone: string;
  active: boolean;
}

const CreateSequence = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: "",
    type: "one-time",
    fromNumber: "",
    retries: false,
    scheduleType: "immediately",
    scheduleDate: "",
    scheduleTime: "",
    fallback: "email",
    recipientType: "contact-list",
  });
  const [seqSteps, setSeqSteps] = useState<SeqStep[]>([]);
  const [recipients, setRecipients] = useState([{ name: "", phone: "" }]);
  const [showAI, setShowAI] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [generating, setGenerating] = useState(false);

  const update = (key: string, val: any) => setForm((p) => ({ ...p, [key]: val }));

  const addStep = () => setSeqSteps((p) => [...p, { templateName: "", day: 1, sendTime: "09:00", timezone: "IST", active: true }]);
  const removeStep = (i: number) => setSeqSteps((p) => p.filter((_, idx) => idx !== i));

  const handleAIGenerate = async () => {
    setGenerating(true);
    try {
      const res = await api.post("/sequences/generate", { prompt: aiPrompt });
      if (res.data.steps) setSeqSteps(res.data.steps);
      setShowAI(false);
    } catch {
      alert("AI generation failed.");
    } finally {
      setGenerating(false);
    }
  };

  const handleSubmit = async () => {
    try {
      await api.post("/sequences", { ...form, steps: seqSteps, recipients });
      navigate("/sequences");
    } catch {
      alert("Failed to create sequence.");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-foreground">Create New WhatsApp Sequence</h1>
        <div className="flex items-center gap-4">
          <StepBar steps={steps} current={step} />
          <button className="border border-crm-border rounded-lg px-4 py-2 text-sm text-foreground hover:bg-muted">Save as Draft</button>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-crm-border p-8 min-h-[400px]">
        {/* STEP 0: Details */}
        {step === 0 && (
          <div>
            <input className="border border-crm-border rounded-lg px-4 py-2.5 text-sm w-full mb-5" placeholder="Sequence Name" value={form.name} onChange={(e) => update("name", e.target.value)} />
            <label className="text-sm font-medium text-foreground">Select your Sequence type</label>
            <div className="grid grid-cols-2 gap-4 mt-3">
              {[
                { val: "one-time", icon: Calendar, title: "One Time Sequence", desc: "Send a one-time broadcast notification to many customers at once." },
                { val: "ongoing", icon: RefreshCw, title: "Ongoing Sequence", desc: "Set notification to be sent upon the occurrence of an external pre-defined trigger." },
              ].map((opt) => (
                <div
                  key={opt.val}
                  onClick={() => update("type", opt.val)}
                  className={`border-2 rounded-xl p-4 cursor-pointer transition-colors ${
                    form.type === opt.val ? "border-crm-blue bg-crm-blue-light" : "border-crm-border"
                  }`}
                >
                  <opt.icon size={20} className="text-crm-blue mb-2" />
                  <div className="font-semibold text-sm text-foreground">{opt.title}</div>
                  <div className="text-xs text-muted-foreground mt-1">{opt.desc}</div>
                </div>
              ))}
            </div>

            <select className="border border-crm-border rounded-lg px-4 py-2.5 text-sm w-full mt-5" value={form.fromNumber} onChange={(e) => update("fromNumber", e.target.value)}>
              <option value="">Select 'From' WhatsApp Number</option>
              <option>+91 9876543210</option>
            </select>

            <div className="flex items-center justify-between mt-5">
              <label className="text-sm font-medium text-foreground">Activate Retries</label>
              <ToggleSwitch checked={form.retries} onChange={(v) => update("retries", v)} />
            </div>
            <ul className="text-crm-blue text-[13px] mt-2 space-y-1 list-disc list-inside">
              <li>Retries don't add any extra cost to the sequence.</li>
              <li>Retries are done only for those messages which fail due to Meta's frequency capping.</li>
            </ul>

            <div className="flex justify-end gap-3 mt-8">
              <button onClick={() => navigate("/sequences")} className="border border-crm-border rounded-lg px-4 py-2 text-sm text-foreground hover:bg-muted">Cancel</button>
              <button onClick={() => setStep(1)} className="bg-crm-blue text-primary-foreground px-5 py-2 rounded-lg text-sm font-medium hover:bg-crm-blue-dark">Save & Continue</button>
            </div>
          </div>
        )}

        {/* STEP 1: Template */}
        {step === 1 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar size={16} /> Select a message template from the library
              </div>
              <button className="border border-crm-border rounded-lg px-4 py-2 text-sm text-foreground hover:bg-muted">Choose template</button>
            </div>

            <button onClick={() => setShowAI(true)} className="bg-crm-blue text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-crm-blue-dark inline-flex items-center gap-2 mb-4">
              <Sparkles size={16} /> Generate Sequence with AI
            </button>

            {seqSteps.length > 0 && (
              <table className="w-full text-sm border border-crm-border rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-muted/50 border-b border-crm-border">
                    <th className="text-left p-3 font-medium text-muted-foreground">Template Name</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Day</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Send Time</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Timezone</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Active</th>
                    <th className="p-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {seqSteps.map((s, i) => (
                    <tr key={i} className="border-b border-crm-border">
                      <td className="p-3"><input className="border border-crm-border rounded px-2 py-1 text-sm w-full" value={s.templateName} onChange={(e) => { const ns = [...seqSteps]; ns[i].templateName = e.target.value; setSeqSteps(ns); }} /></td>
                      <td className="p-3"><input type="number" className="border border-crm-border rounded px-2 py-1 text-sm w-16" value={s.day} onChange={(e) => { const ns = [...seqSteps]; ns[i].day = +e.target.value; setSeqSteps(ns); }} /></td>
                      <td className="p-3"><input type="time" className="border border-crm-border rounded px-2 py-1 text-sm" value={s.sendTime} onChange={(e) => { const ns = [...seqSteps]; ns[i].sendTime = e.target.value; setSeqSteps(ns); }} /></td>
                      <td className="p-3 text-muted-foreground">IST</td>
                      <td className="p-3"><ToggleSwitch checked={s.active} onChange={(v) => { const ns = [...seqSteps]; ns[i].active = v; setSeqSteps(ns); }} /></td>
                      <td className="p-3"><button onClick={() => removeStep(i)}><Trash2 size={14} className="text-crm-red" /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <button onClick={addStep} className="text-crm-blue text-sm mt-3 hover:underline">+ Add Step</button>

            <div className="flex justify-end gap-3 mt-8">
              <button onClick={() => setStep(0)} className="border border-crm-border rounded-lg px-4 py-2 text-sm text-foreground hover:bg-muted">Cancel</button>
              <button onClick={() => setStep(2)} className="bg-crm-blue text-primary-foreground px-5 py-2 rounded-lg text-sm font-medium hover:bg-crm-blue-dark">Save & Continue</button>
            </div>
          </div>
        )}

        {/* STEP 2: Recipients */}
        {step === 2 && (
          <div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              {[
                { val: "contact-list", title: "Contact List", desc: "Select from existing contact lists" },
                { val: "manual", title: "Manual Entry", desc: "Add recipients manually" },
              ].map((opt) => (
                <div
                  key={opt.val}
                  onClick={() => update("recipientType", opt.val)}
                  className={`border-2 rounded-xl p-4 cursor-pointer transition-colors ${
                    form.recipientType === opt.val ? "border-crm-blue bg-crm-blue-light" : "border-crm-border"
                  }`}
                >
                  <div className="font-semibold text-sm text-foreground">{opt.title}</div>
                  <div className="text-xs text-muted-foreground mt-1">{opt.desc}</div>
                </div>
              ))}
            </div>

            {form.recipientType === "contact-list" ? (
              <table className="w-full text-sm border border-crm-border rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-muted/50 border-b border-crm-border">
                    <th className="p-3 w-8"><input type="checkbox" /></th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Name</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Contacts</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Last Modified</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Source</th>
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <tr key={i} className="border-b border-crm-border">
                      <td className="p-3"><input type="checkbox" /></td>
                      <td className="p-3 text-foreground">Contact List {i}</td>
                      <td className="p-3 text-muted-foreground">{i * 120}</td>
                      <td className="p-3 text-muted-foreground">25/11/2025</td>
                      <td className="p-3 text-muted-foreground">Import</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div>
                {recipients.map((r, i) => (
                  <div key={i} className="flex gap-3 mb-2">
                    <input className="border border-crm-border rounded-lg px-3 py-2 text-sm flex-1" placeholder="Name (optional)" value={r.name} onChange={(e) => { const nr = [...recipients]; nr[i].name = e.target.value; setRecipients(nr); }} />
                    <input className="border border-crm-border rounded-lg px-3 py-2 text-sm flex-1" placeholder="WhatsApp Number" value={r.phone} onChange={(e) => { const nr = [...recipients]; nr[i].phone = e.target.value; setRecipients(nr); }} />
                    <button onClick={() => setRecipients((p) => p.filter((_, idx) => idx !== i))} className="text-crm-red"><Trash2 size={14} /></button>
                  </div>
                ))}
                <button onClick={() => setRecipients((p) => [...p, { name: "", phone: "" }])} className="text-crm-blue text-sm hover:underline">+ Add Recipients</button>
              </div>
            )}

            <div className="flex justify-end gap-3 mt-8">
              <button onClick={() => setStep(1)} className="border border-crm-border rounded-lg px-4 py-2 text-sm text-foreground hover:bg-muted">Cancel</button>
              <button onClick={() => setStep(3)} className="bg-crm-blue text-primary-foreground px-5 py-2 rounded-lg text-sm font-medium hover:bg-crm-blue-dark">Save & Continue</button>
            </div>
          </div>
        )}

        {/* STEP 3: Schedule */}
        {step === 3 && (
          <div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              {[
                { val: "immediately", title: "Immediately", desc: "Sends the message right away without any delay" },
                { val: "custom", title: "Custom date", desc: "Allows you to schedule the message at a specific date and time." },
              ].map((opt) => (
                <div
                  key={opt.val}
                  onClick={() => update("scheduleType", opt.val)}
                  className={`border-2 rounded-xl p-4 cursor-pointer transition-colors ${
                    form.scheduleType === opt.val ? "border-crm-blue bg-crm-blue-light" : "border-crm-border"
                  }`}
                >
                  <div className="font-semibold text-sm text-foreground">{opt.title}</div>
                  <div className="text-xs text-muted-foreground mt-1">{opt.desc}</div>
                </div>
              ))}
            </div>

            {form.scheduleType === "custom" && (
              <div className="flex gap-3 mb-5">
                <input type="date" className="border border-crm-border rounded-lg px-4 py-2.5 text-sm" value={form.scheduleDate} onChange={(e) => update("scheduleDate", e.target.value)} />
                <input type="time" className="border border-crm-border rounded-lg px-4 py-2.5 text-sm" value={form.scheduleTime} onChange={(e) => update("scheduleTime", e.target.value)} />
              </div>
            )}

            <label className="text-sm font-medium text-foreground">Setup Fallback Channel</label>
            <div className="flex flex-col gap-2 mt-2">
              {["email", "whatsapp"].map((ch) => (
                <label key={ch} className="flex items-center gap-2 text-sm capitalize">
                  <input type="radio" name="fallback" checked={form.fallback === ch} onChange={() => update("fallback", ch)} className="accent-crm-blue" />
                  {ch}
                </label>
              ))}
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <button onClick={() => setStep(2)} className="border border-crm-border rounded-lg px-4 py-2 text-sm text-foreground hover:bg-muted">Cancel</button>
              <button onClick={handleSubmit} className="bg-crm-blue text-primary-foreground px-5 py-2 rounded-lg text-sm font-medium hover:bg-crm-blue-dark">Submit</button>
            </div>
          </div>
        )}
      </div>

      {showAI && (
        <Modal title="Generate Sequence with AI" onClose={() => setShowAI(false)}>
          <textarea className="border border-crm-border rounded-lg px-4 py-3 text-sm w-full resize-none mb-4" rows={3} placeholder="Describe your campaign goal..." value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)} />
          <div className="flex justify-end">
            <button onClick={handleAIGenerate} disabled={generating} className="bg-crm-blue text-primary-foreground px-5 py-2 rounded-lg text-sm font-medium hover:bg-crm-blue-dark disabled:opacity-50">
              {generating ? "Generating..." : "Generate"}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default CreateSequence;
