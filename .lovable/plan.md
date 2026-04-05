
## Plan: Professional App Upgrade

### 1. Real AI Edge Functions (replace mock responses)
- **generate-template**: Use Lovable AI (gemini-3-flash-preview) to generate WhatsApp template content
- **generate-sequence**: Use Lovable AI to generate intelligent sequence steps
- **chatbot**: Replace keyword matching with real AI conversations with streaming

### 2. Template Creation UX
- Add WhatsApp phone preview panel showing live template rendering
- Add form validation (name required, body required)
- Better category selection with icons
- Variable placeholder buttons ({{1}}, {{2}}, etc.)

### 3. Sequence Creation UX  
- Add step reordering (move up/down)
- Form validation at each step
- Summary review before submission
- Better visual step cards instead of table rows

### 4. Chatbot Upgrade
- Real AI-powered conversations via streaming edge function
- Persistent chat history in database
- Markdown rendering for AI responses

### 5. Inbox Enhancements
- Real-time message subscriptions (Supabase Realtime)
- Contact linking (show contact info in conversation)
- Search bar to filter conversations
- Read/unread filtering
- Enable realtime on messages table

### 6. Database Changes
- Enable realtime on messages and conversations tables (migration)
