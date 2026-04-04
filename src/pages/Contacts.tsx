import { useState, useEffect } from "react";
import { Search, Plus, Trash2 } from "lucide-react";
import PaginationBar from "@/components/shared/PaginationBar";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import Modal from "@/components/shared/Modal";

interface Contact {
  id: string;
  name: string;
  phone: string;
  email: string;
  source: string;
  tags: string[];
  created_at: string;
}

const Contacts = () => {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newContact, setNewContact] = useState({ name: "", phone: "", email: "", source: "Manual" });
  const [selected, setSelected] = useState<string[]>([]);

  const fetchContacts = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("contacts").select("*").order("created_at", { ascending: false });
    if (data) setContacts(data as Contact[]);
    if (error) toast.error("Failed to load contacts");
    setLoading(false);
  };

  useEffect(() => { fetchContacts(); }, []);

  const handleAdd = async () => {
    if (!newContact.name.trim()) return toast.error("Name is required");
    const { error } = await supabase.from("contacts").insert({
      user_id: user!.id,
      name: newContact.name,
      phone: newContact.phone,
      email: newContact.email,
      source: newContact.source,
    });
    if (error) return toast.error("Failed to add contact");
    toast.success("Contact added!");
    setNewContact({ name: "", phone: "", email: "", source: "Manual" });
    setShowAdd(false);
    fetchContacts();
  };

  const handleDelete = async () => {
    if (selected.length === 0) return toast.error("Select contacts to delete");
    const { error } = await supabase.from("contacts").delete().in("id", selected);
    if (error) return toast.error("Delete failed");
    toast.success(`Deleted ${selected.length} contact(s)`);
    setSelected([]);
    fetchContacts();
  };

  const filtered = contacts.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.phone?.includes(search) || c.email?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <h1 className="text-xl font-semibold text-foreground mb-5">Contact Hub</h1>

      <div className="flex items-center gap-3 mb-4">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input className="border border-border rounded-lg pl-9 pr-4 py-2 text-sm w-[280px] bg-background" placeholder="Search Contacts" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <button onClick={() => setShowAdd(true)} className="bg-crm-blue text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-crm-blue-dark transition-colors inline-flex items-center gap-2">
          <Plus size={16} /> Add Contact
        </button>
        {selected.length > 0 && (
          <button onClick={handleDelete} className="border border-destructive text-destructive rounded-lg px-4 py-2 text-sm hover:bg-destructive/10 inline-flex items-center gap-2">
            <Trash2 size={14} /> Delete ({selected.length})
          </button>
        )}
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left p-3 w-8"><input type="checkbox" checked={selected.length === filtered.length && filtered.length > 0} onChange={() => selected.length === filtered.length ? setSelected([]) : setSelected(filtered.map(c => c.id))} /></th>
              <th className="text-left p-3 font-medium text-muted-foreground">Contact Name</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Phone Number</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Email</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Created On</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Source</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="text-center py-16 text-muted-foreground">Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-16 text-muted-foreground">No contacts yet. Click Add Contact to get started.</td></tr>
            ) : (
              filtered.slice((page - 1) * 20, page * 20).map((c) => (
                <tr key={c.id} className="border-b border-border hover:bg-muted/30">
                  <td className="p-3"><input type="checkbox" checked={selected.includes(c.id)} onChange={() => setSelected(prev => prev.includes(c.id) ? prev.filter(s => s !== c.id) : [...prev, c.id])} /></td>
                  <td className="p-3 font-medium text-foreground">{c.name}</td>
                  <td className="p-3 text-muted-foreground">{c.phone || "-"}</td>
                  <td className="p-3 text-muted-foreground">{c.email || "-"}</td>
                  <td className="p-3 text-muted-foreground text-xs">{new Date(c.created_at).toLocaleDateString()}</td>
                  <td className="p-3 text-muted-foreground">{c.source}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <PaginationBar total={filtered.length} page={page} perPage={20} onChange={setPage} />

      {showAdd && (
        <Modal title="Add New Contact" onClose={() => setShowAdd(false)}>
          <div className="space-y-3">
            <input className="border border-border rounded-lg px-4 py-2.5 text-sm w-full bg-background" placeholder="Full Name *" value={newContact.name} onChange={(e) => setNewContact(p => ({ ...p, name: e.target.value }))} />
            <input className="border border-border rounded-lg px-4 py-2.5 text-sm w-full bg-background" placeholder="Phone Number" value={newContact.phone} onChange={(e) => setNewContact(p => ({ ...p, phone: e.target.value }))} />
            <input className="border border-border rounded-lg px-4 py-2.5 text-sm w-full bg-background" type="email" placeholder="Email" value={newContact.email} onChange={(e) => setNewContact(p => ({ ...p, email: e.target.value }))} />
            <select className="border border-border rounded-lg px-4 py-2.5 text-sm w-full bg-background" value={newContact.source} onChange={(e) => setNewContact(p => ({ ...p, source: e.target.value }))}>
              <option>Manual</option><option>WhatsApp</option><option>Import</option><option>Website</option>
            </select>
          </div>
          <div className="flex justify-end mt-4">
            <button onClick={handleAdd} className="bg-crm-blue text-primary-foreground px-5 py-2 rounded-lg text-sm font-medium hover:bg-crm-blue-dark">Add Contact</button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Contacts;
