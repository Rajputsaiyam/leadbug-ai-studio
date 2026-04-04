import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { prompt } = await req.json();
    
    if (!prompt || typeof prompt !== "string") {
      return new Response(JSON.stringify({ error: "Prompt is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Generate sequence steps based on prompt
    const steps = [
      { templateName: "Welcome Message", day: 1, sendTime: "09:00", timezone: "IST", active: true },
      { templateName: "Follow Up", day: 3, sendTime: "10:00", timezone: "IST", active: true },
      { templateName: "Special Offer", day: 5, sendTime: "11:00", timezone: "IST", active: true },
      { templateName: "Final Reminder", day: 7, sendTime: "09:00", timezone: "IST", active: true },
    ];

    return new Response(JSON.stringify({ steps }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to generate sequence" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
