import { useState } from "react";
import { Search } from "lucide-react";
import PaginationBar from "@/components/shared/PaginationBar";

const mockContacts = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  name: "Website Development",
  phone: "+91 XXXXXXXXXX",
  email: "demoghn@gmail.com",
  createdOn: "25/11/2025",
  source: "WhatsApp",
  tags: "-",
}));

const Contacts = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = mockContacts.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <h1 className="text-xl font-semibold text-foreground mb-5">Contact Hub</h1>

      <div className="flex items-center gap-3 mb-4">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input className="border border-crm-border rounded-lg pl-9 pr-4 py-2 text-sm w-[280px]" placeholder="Search Contacts" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <button className="border border-crm-border rounded-lg px-4 py-2 text-sm text-foreground hover:bg-muted">Send Notifications</button>
        <button className="border border-crm-border rounded-lg px-4 py-2 text-sm text-muted-foreground hover:bg-muted">More Actions ▾</button>
      </div>

      <div className="bg-card rounded-xl border border-crm-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-crm-border bg-muted/50">
              <th className="text-left p-3 w-8"><input type="checkbox" /></th>
              <th className="text-left p-3 font-medium text-muted-foreground">Contact Name</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Phone Number</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Email Id</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Created On</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Source</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Tags</th>
            </tr>
          </thead>
          <tbody>
            {filtered.slice((page - 1) * 20, page * 20).map((c) => (
              <tr key={c.id} className="border-b border-crm-border hover:bg-muted/30">
                <td className="p-3"><input type="checkbox" /></td>
                <td className="p-3 font-medium text-foreground">{c.name}</td>
                <td className="p-3 text-muted-foreground">{c.phone}</td>
                <td className="p-3 text-muted-foreground">{c.email}</td>
                <td className="p-3 text-muted-foreground">{c.createdOn}</td>
                <td className="p-3 text-muted-foreground">{c.source}</td>
                <td className="p-3 text-muted-foreground">{c.tags}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <PaginationBar total={filtered.length} page={page} perPage={20} onChange={setPage} />
    </div>
  );
};

export default Contacts;
