import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: "Messages array is required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const GEMINI_KEY = Deno.env.get("GOOGLE_GEMINI_API_KEY");
    if (!GEMINI_KEY) throw new Error("GOOGLE_GEMINI_API_KEY not configured");

    const systemPrompt = `You are the LeadBug CRM AI assistant — a friendly, knowledgeable support bot for a WhatsApp CRM platform.

You help users with:
- Creating and managing WhatsApp message templates
- Setting up automated sequences/campaigns
- Managing contacts and contact lists
- Understanding analytics and delivery metrics
- Navigating the CRM dashboard
- Best practices for WhatsApp Business messaging

RULES:
- Be concise but helpful
- Use markdown formatting for better readability
- If the user wants to speak to a human agent, respond with exactly: [ESCALATE]
- Stay on topic — you only help with LeadBug CRM features
- Suggest next steps when appropriate`;

    // Convert OpenAI-style messages to Gemini format
    const geminiContents = [];
    
    // Add system instruction as first user turn context
    const userMessages = messages.filter((m: any) => m.role === "user" || m.role === "assistant");
    
    for (const msg of userMessages) {
      geminiContents.push({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      });
    }

    // If no messages yet, add a placeholder
    if (geminiContents.length === 0) {
      geminiContents.push({ role: "user", parts: [{ text: "Hello" }] });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemPrompt }] },
          contents: geminiContents,
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error("Gemini error:", response.status, errText);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const aiData = await response.json();
    const content = aiData.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!content) throw new Error("No content in Gemini response");

    // Return as a non-streaming response since Gemini REST doesn't stream the same way
    // We'll simulate an SSE stream so the frontend code still works
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        const chunk = JSON.stringify({
          choices: [{ delta: { content } }],
        });
        controller.enqueue(encoder.encode(`data: ${chunk}\n\n`));
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      },
    });

    return new Response(stream, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("chatbot error:", error);
    return new Response(JSON.stringify({ error: "Chatbot error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
