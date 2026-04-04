import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "@supabase/supabase-js/cors";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { prompt, category } = await req.json();
    
    if (!prompt || typeof prompt !== "string") {
      return new Response(JSON.stringify({ error: "Prompt is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Generate template content based on category and prompt
    const templates: Record<string, { header: string; body: string; footer: string }> = {
      Marketing: {
        header: "🎉 Special Offer!",
        body: `Hi {{1}}! ${prompt}\n\nWe're excited to share this exclusive offer with you. Don't miss out on our limited-time deal!\n\n✅ Exclusive discount\n✅ Free shipping\n✅ 24/7 support\n\nReply YES to learn more!`,
        footer: "Powered by LeadBug CRM",
      },
      Utility: {
        header: "📋 Update",
        body: `Hello {{1}},\n\n${prompt}\n\nYour request has been processed successfully. Here are the details:\n\n📌 Reference: #{{2}}\n📅 Date: {{3}}\n\nIf you have any questions, please reply to this message.`,
        footer: "This is an automated notification",
      },
      Authentication: {
        header: "🔐 Verification",
        body: `Your verification code is: {{1}}\n\nThis code expires in 10 minutes. Do not share this code with anyone.\n\nIf you didn't request this, please ignore this message.`,
        footer: "LeadBug Security",
      },
    };

    const template = templates[category] || templates.Marketing;

    return new Response(JSON.stringify(template), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to generate template" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
