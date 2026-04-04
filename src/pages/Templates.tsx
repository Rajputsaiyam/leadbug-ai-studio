import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, RefreshCw, Trash2, Edit, SlidersHorizontal, Settings } from "lucide-react";
import StatusBadge from "@/components/shared/StatusBadge";
import PaginationBar from "@/components/shared/PaginationBar";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface Template {
  id: string;
  name: string;
  body: string;
  category: string;
  status: string;
  sent_count: number;
  delivered_count: number;
  clicked_count: number;
  opened_count: number;
  created_at: string;
}

const Templates = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState("templates");
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTemplates = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("templates")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setTemplates(data as Template[]);
    if (error) toast.error("Failed to load templates");
    setLoading(false);
  };

  useEffect(() => { fetchTemplates(); }, []);

  const handleDelete = async () => {
    if (selected.length === 0) return toast.error("Select templates to delete");
    const { error } = await supabase.from("templates").delete().in("id", selected);
    if (error) return toast.error("Delete failed");
    toast.success(`Deleted ${selected.length} template(s)`);
    setSelected([]);
    fetchTemplates();
  };

  const toggleSelect = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    if (selected.length === filtered.length) setSelected([]);
    else setSelected(filtered.map(t => t.id));
  };

  const filtered = templates.filter((t) => t.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl font-semibold text-foreground">WhatsApp Templates</h1>
        <div className="flex items-center gap-3">
          <StatusBadge status="Good" />
          <button className="text-xs text-crm-blue hover:underline">Notifications Limit</button>
          <button onClick={() => navigate("/templates/new")} className="bg-crm-blue text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-crm-blue-dark transition-colors">
            Create Templates
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input className="border border-border rounded-lg pl-9 pr-4 py-2 text-sm w-[280px] bg-background" placeholder="Search templates..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="flex bg-muted rounded-lg p-0.5">
            <button onClick={() => setActiveTab("templates")} className={`px-4 py-1.5 rounded-md text-xs font-medium ${activeTab === "templates" ? "bg-crm-blue text-primary-foreground" : "text-muted-foreground"}`}>Templates</button>
            <button onClick={() => { setActiveTab("sequences"); navigate("/sequences"); }} className={`px-4 py-1.5 rounded-md text-xs font-medium ${activeTab === "sequences" ? "bg-crm-blue text-primary-foreground" : "text-muted-foreground"}`}>Sequences</button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchTemplates} className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-muted"><RefreshCw size={14} className="text-muted-foreground" /></button>
          <button onClick={handleDelete} className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-muted"><Trash2 size={14} className="text-muted-foreground" /></button>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left p-3 w-8"><input type="checkbox" checked={selected.length === filtered.length && filtered.length > 0} onChange={toggleSelectAll} /></th>
              <th className="text-left p-3 font-medium text-muted-foreground">Title</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Category</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Created</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Sent</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Delivered</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="text-center py-16 text-muted-foreground">Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-16 text-muted-foreground">No templates yet. Click Create Templates to get started.</td></tr>
            ) : (
              filtered.slice((page - 1) * 20, page * 20).map((t) => (
                <tr key={t.id} className="border-b border-border hover:bg-muted/30">
                  <td className="p-3"><input type="checkbox" checked={selected.includes(t.id)} onChange={() => toggleSelect(t.id)} /></td>
                  <td className="p-3 font-medium text-foreground">{t.name}</td>
                  <td className="p-3 text-muted-foreground">{t.category}</td>
                  <td className="p-3"><StatusBadge status={t.status || "Pending"} /></td>
                  <td className="p-3 text-muted-foreground text-xs">{new Date(t.created_at).toLocaleDateString()}</td>
                  <td className="p-3 text-muted-foreground">{t.sent_count}</td>
                  <td className="p-3 text-muted-foreground">{t.delivered_count}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <PaginationBar total={filtered.length} page={page} perPage={20} onChange={setPage} />
    </div>
  );
};

export default Templates;
