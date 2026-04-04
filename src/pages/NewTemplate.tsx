import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";
import Modal from "@/components/shared/Modal";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const NewTemplate = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Marketing");
  const [buttonType, setButtonType] = useState("None");
  const [headerType, setHeaderType] = useState("None");
  const [headerText, setHeaderText] = useState("");
  const [body, setBody] = useState("");
  const [footer, setFooter] = useState("");
  const [varCount, setVarCount] = useState(0);
  const [showAI, setShowAI] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);

  const addVariable = () => {
    const next = varCount + 1;
    setVarCount(next);
    setBody((p) => p + `{{${next}}}`);
  };

  const handleGenerate = async () => {
    if (!aiPrompt.trim()) return;
    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-template", {
        body: { prompt: aiPrompt, category },
      });
      if (error) throw error;
      if (data?.body) setBody(data.body);
      if (data?.header) setHeaderText(data.header);
      if (data?.footer) setFooter(data.footer);
      setShowAI(false);
      toast.success("Template generated!");
    } catch {
      toast.error("AI generation failed. Try again.");
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) return toast.error("Template name is required");
    if (!body.trim()) return toast.error("Template body is required");
    setSaving(true);
    const { error } = await supabase.from("templates").insert({
      user_id: user!.id,
      name,
      category,
      body,
      header: headerText || null,
      footer: footer || null,
      button_type: buttonType,
    });
    if (error) {
      toast.error("Failed to save template");
    } else {
      toast.success("Template saved!");
      navigate("/templates");
    }
    setSaving(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl font-semibold text-foreground">New Template</h1>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/templates")} className="border border-border rounded-lg px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="bg-crm-blue text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-crm-blue-dark transition-colors disabled:opacity-50">
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <input className="border border-border rounded-lg px-4 py-2.5 text-sm bg-background" placeholder="Template Name" value={name} onChange={(e) => setName(e.target.value)} />
        <select className="border border-border rounded-lg px-4 py-2.5 text-sm bg-background" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option>Marketing</option><option>Utility</option><option>Authentication</option>
        </select>
        <select className="border border-border rounded-lg px-4 py-2.5 text-sm bg-background" value={buttonType} onChange={(e) => setButtonType(e.target.value)}>
          <option>None</option><option>Copy Code</option><option>URL</option><option>Quick Reply</option>
        </select>
      </div>

      <div className="mb-4">
        <span className="text-sm font-medium text-foreground">Template(s)</span>
        <button className="ml-3 text-crm-blue text-sm border border-dashed border-crm-blue rounded-full px-4 py-1">+ Add Language</button>
      </div>

      <div className="flex gap-6">
        <div className="w-[35%]">
          <div className="bg-card border border-border rounded-xl p-4 max-w-[280px]">
            <div className="bg-[#E8F5E9] rounded-lg p-3 text-sm">
              {headerText && <div className="font-bold text-foreground mb-1">{headerText}</div>}
              <div className="text-foreground whitespace-pre-wrap text-xs">{body || "Your message preview will appear here..."}</div>
              {footer && <div className="text-muted-foreground text-[10px] mt-2">{footer}</div>}
              {buttonType !== "None" && (
                <div className="mt-2 pt-2 border-t border-border">
                  <div className="text-crm-blue text-xs text-center font-medium">{buttonType}</div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-5">
          <div>
            <label className="text-sm font-medium text-foreground">Header (Optional)</label>
            <p className="text-xs text-muted-foreground mb-2">Add a title or select media type</p>
            <div className="flex items-center gap-4 mb-2">
              {["None", "Text", "Image", "Video", "Document"].map((t) => (
                <label key={t} className="flex items-center gap-1.5 text-sm">
                  <input type="radio" name="headerType" checked={headerType === t} onChange={() => setHeaderType(t)} className="accent-crm-blue" />
                  {t}
                </label>
              ))}
            </div>
            {headerType === "Text" && <input className="border border-border rounded-lg px-4 py-2.5 text-sm w-full bg-background" placeholder="Header text" value={headerText} onChange={(e) => setHeaderText(e.target.value)} />}
          </div>

          <button onClick={() => setShowAI(true)} className="bg-crm-blue text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-crm-blue-dark transition-colors inline-flex items-center gap-2">
            <Sparkles size={16} /> Generate with AI
          </button>

          <div>
            <label className="text-sm font-medium text-foreground">Body</label>
            <p className="text-xs text-muted-foreground mb-2">The WhatsApp message in the language you have selected</p>
            <textarea className="border border-border rounded-lg px-4 py-3 text-sm w-full resize-none bg-background" rows={5} placeholder="Typing..." maxLength={1024} value={body} onChange={(e) => setBody(e.target.value)} />
            <div className="flex items-center justify-between">
              <button onClick={addVariable} className="text-crm-blue text-[13px] hover:underline">+ Add variable</button>
              <span className="text-xs text-muted-foreground">{body.length}/1024</span>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">Footer (Optional)</label>
            <p className="text-xs text-muted-foreground mb-2">Add a short line of text to the bottom of your message template.</p>
            <input className="border border-border rounded-lg px-4 py-2.5 text-sm w-full bg-background" placeholder="Footer text" value={footer} onChange={(e) => setFooter(e.target.value)} />
          </div>
        </div>
      </div>

      {showAI && (
        <Modal title="Generate Template with AI" onClose={() => setShowAI(false)}>
          <textarea className="border border-border rounded-lg px-4 py-3 text-sm w-full resize-none mb-3 bg-background" rows={3} placeholder="Describe your template purpose..." value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)} />
          <select className="border border-border rounded-lg px-4 py-2.5 text-sm w-full mb-4 bg-background" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option>Marketing</option><option>Utility</option><option>Authentication</option>
          </select>
          <div className="flex justify-end">
            <button onClick={handleGenerate} disabled={generating} className="bg-crm-blue text-primary-foreground px-5 py-2 rounded-lg text-sm font-medium hover:bg-crm-blue-dark transition-colors disabled:opacity-50">
              {generating ? "Generating..." : "Generate"}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default NewTemplate;
