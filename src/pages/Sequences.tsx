import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import StatusBadge from "@/components/shared/StatusBadge";
import ToggleSwitch from "@/components/shared/ToggleSwitch";
import PaginationBar from "@/components/shared/PaginationBar";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Sequence {
  id: string;
  name: string;
  channel: string;
  category: string;
  status: string;
  active: boolean;
  attempted: number;
  sent_pct: string;
  delivered_pct: string;
  created_at: string;
}

const Sequences = () => {
  const navigate = useNavigate();
  const [sequences, setSequences] = useState<Sequence[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchSequences = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("sequences")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setSequences(data as Sequence[]);
    if (error) toast.error("Failed to load sequences");
    setLoading(false);
  };

  useEffect(() => { fetchSequences(); }, []);

  const toggleActive = async (seq: Sequence) => {
    const { error } = await supabase
      .from("sequences")
      .update({ active: !seq.active })
      .eq("id", seq.id);
    if (error) return toast.error("Update failed");
    setSequences(prev => prev.map(s => s.id === seq.id ? { ...s, active: !s.active } : s));
    toast.success(`Sequence ${!seq.active ? "activated" : "deactivated"}`);
  };

  const filtered = sequences.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl font-semibold text-foreground">WhatsApp Sequences</h1>
        <div className="flex items-center gap-3">
          <StatusBadge status="Good" />
          <button onClick={() => navigate("/sequences/new")} className="bg-crm-blue text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-crm-blue-dark transition-colors">
            Create Sequence
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input className="border border-border rounded-lg pl-9 pr-4 py-2 text-sm w-[280px] bg-background" placeholder="Search sequences..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left p-3 font-medium text-muted-foreground">ON/OFF</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Sequence Name</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Channel</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Category</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Attempted</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Sent</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Delivered</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} className="text-center py-16 text-muted-foreground">Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={8} className="text-center py-16 text-muted-foreground">No sequences yet. Click Create Sequence to get started.</td></tr>
            ) : (
              filtered.slice((page - 1) * 20, page * 20).map((s) => (
                <tr key={s.id} className="border-b border-border hover:bg-muted/30">
                  <td className="p-3"><ToggleSwitch checked={s.active} onChange={() => toggleActive(s)} /></td>
                  <td className="p-3 font-medium text-foreground">{s.name}</td>
                  <td className="p-3 text-muted-foreground">{s.channel}</td>
                  <td className="p-3 text-muted-foreground">{s.category}</td>
                  <td className="p-3"><StatusBadge status={s.status} /></td>
                  <td className="p-3 text-muted-foreground">{s.attempted}</td>
                  <td className="p-3 text-muted-foreground">{s.sent_pct}</td>
                  <td className="p-3 text-muted-foreground">{s.delivered_pct}</td>
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

export default Sequences;
