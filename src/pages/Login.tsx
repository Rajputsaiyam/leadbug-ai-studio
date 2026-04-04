import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { MessageCircle } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (isSignUp) {
      const { error } = await signUp(email, password, fullName);
      if (error) {
        setError(error.message);
      } else {
        setSuccess("Account created! Check your email to confirm, or sign in now.");
        setIsSignUp(false);
      }
    } else {
      const { error } = await signIn(email, password);
      if (error) {
        setError(error.message);
      } else {
        navigate("/dashboard");
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="bg-card rounded-xl p-10 w-[440px] shadow-lg border border-border">
        <div className="flex items-center gap-2 justify-center mb-8">
          <div className="w-10 h-10 bg-crm-blue rounded-lg flex items-center justify-center">
            <MessageCircle size={22} className="text-primary-foreground" />
          </div>
          <span className="font-bold text-xl text-foreground">LeadBug CRM</span>
        </div>

        <h2 className="text-xl font-bold text-foreground text-center mb-6">
          {isSignUp ? "Create your account" : "Welcome back"}
        </h2>

        {error && <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg mb-4">{error}</div>}
        {success && <div className="bg-crm-green/10 text-crm-green text-sm p-3 rounded-lg mb-4">{success}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {isSignUp && (
            <input
              className="border border-border rounded-lg px-4 py-2.5 text-sm bg-background text-foreground"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          )}
          <input
            className="border border-border rounded-lg px-4 py-2.5 text-sm bg-background text-foreground"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="border border-border rounded-lg px-4 py-2.5 text-sm bg-background text-foreground"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-crm-blue text-primary-foreground py-2.5 rounded-lg text-sm font-semibold hover:bg-crm-blue-dark transition-colors disabled:opacity-50 mt-2"
          >
            {loading ? "Please wait..." : isSignUp ? "Sign Up" : "Sign In"}
          </button>
        </form>

        <div className="text-center mt-5">
          <button
            onClick={() => { setIsSignUp(!isSignUp); setError(""); setSuccess(""); }}
            className="text-sm text-crm-blue hover:underline"
          >
            {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
