import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "@supabase/supabase-js/cors";

const responses: Record<string, string> = {
  hello: "Hello! Welcome to LeadBug CRM. How can I help you today?",
  hi: "Hi there! I'm the LeadBug AI assistant. What can I do for you?",
  help: "I can help you with:\n• Creating WhatsApp templates\n• Setting up campaigns\n• Managing contacts\n• Understanding analytics\n\nWhat would you like to know more about?",
  template: "To create a template, go to Templates → Create Templates. You can use our AI generator to create professional templates quickly. Would you like me to guide you through it?",
  campaign: "To start a campaign:\n1. Create a template first\n2. Go to Sequences → Create Sequence\n3. Add your template and recipients\n4. Schedule and send!\n\nNeed help with any step?",
  contact: "You can manage contacts in the Contact Hub. Add contacts manually, import from CSV, or they'll be added automatically from WhatsApp conversations.",
  price: "LeadBug offers flexible pricing plans starting from ₹999/month. Visit our Pricing page for detailed information.",
  agent: "I'll connect you to a human agent right away. Please hold on...",
  human: "I'll connect you to a human agent right away. Please hold on...",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { message, sessionId } = await req.json();
    
    if (!message || typeof message !== "string") {
      return new Response(JSON.stringify({ error: "Message is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const lowerMsg = message.toLowerCase().trim();
    
    // Check for escalation keywords
    const escalationKeywords = ["agent", "human", "person", "speak to someone", "real person", "escalate"];
    const escalated = escalationKeywords.some(k => lowerMsg.includes(k));

    // Find best matching response
    let reply = "Thank you for your message! I'm here to help with anything related to LeadBug CRM - templates, campaigns, contacts, and more. What would you like to know?";
    
    for (const [key, value] of Object.entries(responses)) {
      if (lowerMsg.includes(key)) {
        reply = value;
        break;
      }
    }

    // Add delay to simulate thinking
    await new Promise(resolve => setTimeout(resolve, 500));

    return new Response(JSON.stringify({ reply, escalated }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Chatbot error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
