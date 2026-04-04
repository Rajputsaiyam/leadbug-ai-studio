import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, RefreshCw, Sparkles, Trash2 } from "lucide-react";
import StepBar from "@/components/shared/StepBar";
import ToggleSwitch from "@/components/shared/ToggleSwitch";
import Modal from "@/components/shared/Modal";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

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
  const { user } = useAuth();
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
  const [contacts, setContacts] = useState<any[]>([]);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);

  useEffect(() => {
    supabase.from("contacts").select("id, name, phone, created_at").then(({ data }) => {
      if (data) setContacts(data);
    });
  }, []);

  const update = (key: string, val: any) => setForm((p) => ({ ...p, [key]: val }));
  const addStep = () => setSeqSteps((p) => [...p, { templateName: "", day: 1, sendTime: "09:00", timezone: "IST", active: true }]);
  const removeStep = (i: number) => setSeqSteps((p) => p.filter((_, idx) => idx !== i));

  const handleAIGenerate = async () => {
    if (!aiPrompt.trim()) return;
    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-sequence", {
        body: { prompt: aiPrompt },
      });
      if (error) throw error;
      if (data?.steps) setSeqSteps(data.steps);
      setShowAI(false);
      toast.success("Sequence generated!");
    } catch {
      toast.error("AI generation failed.");
    } finally {
      setGenerating(false);
    }
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) return toast.error("Sequence name is required");
    
    const scheduleDate = form.scheduleType === "custom" && form.scheduleDate 
      ? new Date(`${form.scheduleDate}T${form.scheduleTime || "09:00"}`).toISOString() 
      : null;

    const { data: seq, error } = await supabase.from("sequences").insert({
      user_id: user!.id,
      name: form.name,
      type: form.type,
      from_number: form.fromNumber,
      retries: form.retries,
      schedule_type: form.scheduleType,
      schedule_date: scheduleDate,
      fallback: form.fallback,
      status: "Draft",
    }).select().single();

    if (error || !seq) return toast.error("Failed to create sequence");

    // Insert steps
    if (seqSteps.length > 0) {
      await supabase.from("sequence_steps").insert(
        seqSteps.map((s, i) => ({
          sequence_id: seq.id,
          template_name: s.templateName,
          day: s.day,
          send_time: s.sendTime,
          timezone: s.timezone,
          active: s.active,
          sort_order: i,
        }))
      );
    }

    toast.success("Sequence created!");
    navigate("/sequences");
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-foreground">Create New WhatsApp Sequence</h1>
        <div className="flex items-center gap-4">
          <StepBar steps={steps} current={step} />
          <button className="border border-border rounded-lg px-4 py-2 text-sm text-foreground hover:bg-muted">Save as Draft</button>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border p-8 min-h-[400px]">
        {step === 0 && (
          <div>
            <input className="border border-border rounded-lg px-4 py-2.5 text-sm w-full mb-5 bg-background" placeholder="Sequence Name" value={form.name} onChange={(e) => update("name", e.target.value)} />
            <label className="text-sm font-medium text-foreground">Select your Sequence type</label>
            <div className="grid grid-cols-2 gap-4 mt-3">
              {[
                { val: "one-time", icon: Calendar, title: "One Time Sequence", desc: "Send a one-time broadcast notification to many customers at once." },
                { val: "ongoing", icon: RefreshCw, title: "Ongoing Sequence", desc: "Set notification to be sent upon the occurrence of an external pre-defined trigger." },
              ].map((opt) => (
                <div key={opt.val} onClick={() => update("type", opt.val)} className={`border-2 rounded-xl p-4 cursor-pointer transition-colors ${form.type === opt.val ? "border-crm-blue bg-crm-blue-light" : "border-border"}`}>
                  <opt.icon size={20} className="text-crm-blue mb-2" />
                  <div className="font-semibold text-sm text-foreground">{opt.title}</div>
                  <div className="text-xs text-muted-foreground mt-1">{opt.desc}</div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between mt-5">
              <label className="text-sm font-medium text-foreground">Activate Retries</label>
              <ToggleSwitch checked={form.retries} onChange={(v) => update("retries", v)} />
            </div>
            <div className="flex justify-end gap-3 mt-8">
              <button onClick={() => navigate("/sequences")} className="border border-border rounded-lg px-4 py-2 text-sm text-foreground hover:bg-muted">Cancel</button>
              <button onClick={() => setStep(1)} className="bg-crm-blue text-primary-foreground px-5 py-2 rounded-lg text-sm font-medium hover:bg-crm-blue-dark">Save & Continue</button>
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <button onClick={() => setShowAI(true)} className="bg-crm-blue text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-crm-blue-dark inline-flex items-center gap-2 mb-4">
              <Sparkles size={16} /> Generate Sequence with AI
            </button>
            {seqSteps.length > 0 && (
              <table className="w-full text-sm border border-border rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-muted/50 border-b border-border">
                    <th className="text-left p-3 font-medium text-muted-foreground">Template Name</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Day</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Send Time</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Active</th>
                    <th className="p-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {seqSteps.map((s, i) => (
                    <tr key={i} className="border-b border-border">
                      <td className="p-3"><input className="border border-border rounded px-2 py-1 text-sm w-full bg-background" value={s.templateName} onChange={(e) => { const ns = [...seqSteps]; ns[i].templateName = e.target.value; setSeqSteps(ns); }} /></td>
                      <td className="p-3"><input type="number" className="border border-border rounded px-2 py-1 text-sm w-16 bg-background" value={s.day} onChange={(e) => { const ns = [...seqSteps]; ns[i].day = +e.target.value; setSeqSteps(ns); }} /></td>
                      <td className="p-3"><input type="time" className="border border-border rounded px-2 py-1 text-sm bg-background" value={s.sendTime} onChange={(e) => { const ns = [...seqSteps]; ns[i].sendTime = e.target.value; setSeqSteps(ns); }} /></td>
                      <td className="p-3"><ToggleSwitch checked={s.active} onChange={(v) => { const ns = [...seqSteps]; ns[i].active = v; setSeqSteps(ns); }} /></td>
                      <td className="p-3"><button onClick={() => removeStep(i)}><Trash2 size={14} className="text-destructive" /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <button onClick={addStep} className="text-crm-blue text-sm mt-3 hover:underline">+ Add Step</button>
            <div className="flex justify-end gap-3 mt-8">
              <button onClick={() => setStep(0)} className="border border-border rounded-lg px-4 py-2 text-sm text-foreground hover:bg-muted">Back</button>
              <button onClick={() => setStep(2)} className="bg-crm-blue text-primary-foreground px-5 py-2 rounded-lg text-sm font-medium hover:bg-crm-blue-dark">Save & Continue</button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              {[
                { val: "contact-list", title: "Contact List", desc: "Select from existing contacts" },
                { val: "manual", title: "Manual Entry", desc: "Add recipients manually" },
              ].map((opt) => (
                <div key={opt.val} onClick={() => update("recipientType", opt.val)} className={`border-2 rounded-xl p-4 cursor-pointer transition-colors ${form.recipientType === opt.val ? "border-crm-blue bg-crm-blue-light" : "border-border"}`}>
                  <div className="font-semibold text-sm text-foreground">{opt.title}</div>
                  <div className="text-xs text-muted-foreground mt-1">{opt.desc}</div>
                </div>
              ))}
            </div>
            {form.recipientType === "contact-list" ? (
              <table className="w-full text-sm border border-border rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-muted/50 border-b border-border">
                    <th className="p-3 w-8"><input type="checkbox" /></th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Name</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Phone</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.length === 0 ? (
                    <tr><td colSpan={4} className="text-center py-8 text-muted-foreground">No contacts yet. Add contacts first.</td></tr>
                  ) : contacts.map((c: any) => (
                    <tr key={c.id} className="border-b border-border">
                      <td className="p-3"><input type="checkbox" checked={selectedContacts.includes(c.id)} onChange={() => setSelectedContacts(prev => prev.includes(c.id) ? prev.filter(x => x !== c.id) : [...prev, c.id])} /></td>
                      <td className="p-3 text-foreground">{c.name}</td>
                      <td className="p-3 text-muted-foreground">{c.phone}</td>
                      <td className="p-3 text-muted-foreground text-xs">{new Date(c.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div>
                {recipients.map((r, i) => (
                  <div key={i} className="flex gap-3 mb-2">
                    <input className="border border-border rounded-lg px-3 py-2 text-sm flex-1 bg-background" placeholder="Name (optional)" value={r.name} onChange={(e) => { const nr = [...recipients]; nr[i].name = e.target.value; setRecipients(nr); }} />
                    <input className="border border-border rounded-lg px-3 py-2 text-sm flex-1 bg-background" placeholder="WhatsApp Number" value={r.phone} onChange={(e) => { const nr = [...recipients]; nr[i].phone = e.target.value; setRecipients(nr); }} />
                    <button onClick={() => setRecipients(p => p.filter((_, idx) => idx !== i))} className="text-destructive"><Trash2 size={14} /></button>
                  </div>
                ))}
                <button onClick={() => setRecipients(p => [...p, { name: "", phone: "" }])} className="text-crm-blue text-sm hover:underline">+ Add Recipients</button>
              </div>
            )}
            <div className="flex justify-end gap-3 mt-8">
              <button onClick={() => setStep(1)} className="border border-border rounded-lg px-4 py-2 text-sm text-foreground hover:bg-muted">Back</button>
              <button onClick={() => setStep(3)} className="bg-crm-blue text-primary-foreground px-5 py-2 rounded-lg text-sm font-medium hover:bg-crm-blue-dark">Save & Continue</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              {[
                { val: "immediately", title: "Immediately", desc: "Sends the message right away" },
                { val: "custom", title: "Custom date", desc: "Schedule at a specific date and time" },
              ].map((opt) => (
                <div key={opt.val} onClick={() => update("scheduleType", opt.val)} className={`border-2 rounded-xl p-4 cursor-pointer transition-colors ${form.scheduleType === opt.val ? "border-crm-blue bg-crm-blue-light" : "border-border"}`}>
                  <div className="font-semibold text-sm text-foreground">{opt.title}</div>
                  <div className="text-xs text-muted-foreground mt-1">{opt.desc}</div>
                </div>
              ))}
            </div>
            {form.scheduleType === "custom" && (
              <div className="flex gap-3 mb-5">
                <input type="date" className="border border-border rounded-lg px-4 py-2.5 text-sm bg-background" value={form.scheduleDate} onChange={(e) => update("scheduleDate", e.target.value)} />
                <input type="time" className="border border-border rounded-lg px-4 py-2.5 text-sm bg-background" value={form.scheduleTime} onChange={(e) => update("scheduleTime", e.target.value)} />
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
              <button onClick={() => setStep(2)} className="border border-border rounded-lg px-4 py-2 text-sm text-foreground hover:bg-muted">Back</button>
              <button onClick={handleSubmit} className="bg-crm-blue text-primary-foreground px-5 py-2 rounded-lg text-sm font-medium hover:bg-crm-blue-dark">Submit</button>
            </div>
          </div>
        )}
      </div>

      {showAI && (
        <Modal title="Generate Sequence with AI" onClose={() => setShowAI(false)}>
          <textarea className="border border-border rounded-lg px-4 py-3 text-sm w-full resize-none mb-4 bg-background" rows={3} placeholder="Describe your campaign goal..." value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)} />
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
