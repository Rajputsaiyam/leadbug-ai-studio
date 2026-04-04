import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Settings = () => {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState(user?.user_metadata?.full_name || "");

  return (
    <div>
      <h1 className="text-xl font-semibold text-foreground mb-6">Account Settings</h1>
      <div className="bg-card rounded-xl border border-border p-6 max-w-lg">
        <h2 className="font-semibold text-foreground mb-4">Profile Information</h2>
        <div className="space-y-3">
          <div>
            <label className="text-sm text-muted-foreground">Email</label>
            <input className="border border-border rounded-lg px-4 py-2.5 text-sm w-full bg-muted" value={user?.email || ""} disabled />
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Display Name</label>
            <input className="border border-border rounded-lg px-4 py-2.5 text-sm w-full bg-background" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
          </div>
          <button onClick={() => toast.success("Profile updated")} className="bg-crm-blue text-primary-foreground px-5 py-2 rounded-lg text-sm font-medium hover:bg-crm-blue-dark transition-colors">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
