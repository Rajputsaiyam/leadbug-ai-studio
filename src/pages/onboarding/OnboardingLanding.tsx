import { useNavigate } from "react-router-dom";
import { Phone } from "lucide-react";

const OnboardingLanding = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="bg-card rounded-xl p-12 w-[480px] text-center shadow-lg">
        <div className="w-20 h-20 rounded-full bg-[#25D366] flex items-center justify-center mx-auto">
          <Phone size={36} className="text-primary-foreground" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mt-6">Connect WhatsApp Business API</h1>
        <p className="text-sm text-muted-foreground mt-3 mb-8">
          Connect your business WhatsApp number to send campaigns, reminders and replies directly from Leadbug.
        </p>
        <button
          onClick={() => navigate("/onboarding/setup")}
          className="bg-crm-blue text-primary-foreground rounded-full px-7 py-3 text-[15px] font-medium hover:bg-crm-blue-dark transition-colors inline-flex items-center gap-2"
        >
          ⚙ Start WhatsApp Setup
        </button>
        <p className="text-xs text-muted-foreground mt-8">
          Powered by Leadbug & Meta WhatsApp Business Platform.
        </p>
      </div>
    </div>
  );
};

export default OnboardingLanding;
