import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, RefreshCw, Trash2, Edit, SlidersHorizontal, Settings } from "lucide-react";
import StatusBadge from "@/components/shared/StatusBadge";
import PaginationBar from "@/components/shared/PaginationBar";
import api from "@/services/api";

interface Template {
  _id: string;
  name: string;
  body: string;
  category: string;
}

const Templates = () => {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState("templates");

  useEffect(() => {
    api.get("/templates").then((r) => setTemplates(r.data)).catch(() => {});
  }, []);

  const filtered = templates.filter((t) => t.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      {/* Header */}
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

      {/* Search + Tabs */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              className="border border-crm-border rounded-lg pl-9 pr-4 py-2 text-sm w-[280px]"
              placeholder="Search templates..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex bg-muted rounded-lg p-0.5">
            <button onClick={() => setActiveTab("templates")} className={`px-4 py-1.5 rounded-md text-xs font-medium ${activeTab === "templates" ? "bg-crm-blue text-primary-foreground" : "text-muted-foreground"}`}>Templates</button>
            <button onClick={() => { setActiveTab("sequences"); navigate("/sequences"); }} className={`px-4 py-1.5 rounded-md text-xs font-medium ${activeTab === "sequences" ? "bg-crm-blue text-primary-foreground" : "text-muted-foreground"}`}>Sequences</button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="w-8 h-8 rounded-lg border border-crm-border flex items-center justify-center hover:bg-muted"><RefreshCw size={14} className="text-muted-foreground" /></button>
          <button className="w-8 h-8 rounded-lg border border-crm-border flex items-center justify-center hover:bg-muted"><Trash2 size={14} className="text-muted-foreground" /></button>
          <button className="w-8 h-8 rounded-lg border border-crm-border flex items-center justify-center hover:bg-muted"><Edit size={14} className="text-muted-foreground" /></button>
          <button className="w-8 h-8 rounded-lg border border-crm-border flex items-center justify-center hover:bg-muted"><SlidersHorizontal size={14} className="text-muted-foreground" /></button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl border border-crm-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-crm-border bg-muted/50">
              <th className="text-left p-3 w-8"><input type="checkbox" /></th>
              <th className="text-left p-3 font-medium text-muted-foreground">Title</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Information</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Sequence Name</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Created by</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Actions</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Sent</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Delivered</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Clicked</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Opened</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={10} className="text-center py-16 text-muted-foreground">
                  No templates yet. Click Create Templates to get started.
                </td>
              </tr>
            ) : (
              filtered.slice((page - 1) * 20, page * 20).map((t) => (
                <tr key={t._id} className="border-b border-crm-border hover:bg-muted/30">
                  <td className="p-3"><input type="checkbox" /></td>
                  <td className="p-3 font-medium text-foreground">{t.name}</td>
                  <td className="p-3 text-muted-foreground text-xs max-w-[200px] truncate">{t.body}</td>
                  <td className="p-3 text-muted-foreground">WhatsApp</td>
                  <td className="p-3 text-muted-foreground">Admin</td>
                  <td className="p-3"><Settings size={14} className="text-muted-foreground" /></td>
                  <td className="p-3 text-muted-foreground">75%</td>
                  <td className="p-3 text-muted-foreground">75%</td>
                  <td className="p-3 text-muted-foreground">75%</td>
                  <td className="p-3 text-muted-foreground">75%</td>
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
