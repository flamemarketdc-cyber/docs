(function() {
  // --- CONFIGURATION ---
  const CONFIG = {
    botAvatar: "https://i.postimg.cc/bJBHPq11/Flamey.png",
    primaryColor: "#8660FA",
    secondaryColor: "#5E38C2",
    apiUrl: "https://chatbot-for-mintlify.vercel.app/api/chat"
  };

  // 1. Inject Fonts
  if (!document.getElementById('flamey-fonts')) {
    const link = document.createElement('link');
    link.id = 'flamey-fonts';
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Figtree:wght@400;600;800&family=Inter:wght@400;500;600&display=swap';
    document.head.appendChild(link);
  }

  // 2. Inject CSS
  const style = document.createElement('style');
  style.innerHTML = `
    :root {
      --f-primary: ${CONFIG.primaryColor};
      --f-secondary: ${CONFIG.secondaryColor};
      --f-bg: #08080B;
      --f-border: rgba(255, 255, 255, 0.08);
      --f-text: #EAF6FF;
      --f-text-sec: #B0BECF;
    }

    #flamey-root {
      font-family: 'Inter', sans-serif;
      z-index: 2147483647;
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 0;
      pointer-events: none;
    }

    /* --- Floating Search Bar --- */
    #f-bar-container {
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%);
      width: 100%;
      display: flex;
      justify-content: center;
      pointer-events: auto;
      transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
      z-index: 10;
    }

    #f-bar-container.hidden {
      opacity: 0;
      transform: translateX(-50%) translateY(20px) scale(0.9);
      pointer-events: none;
    }

    #f-search-bar {
      width: 320px;
      height: 52px;
      background: rgba(8, 8, 11, 0.9);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid var(--f-border);
      border-radius: 999px;
      display: flex;
      align-items: center;
      padding: 0 6px 0 20px;
      box-shadow: 0 10px 40px -10px rgba(0,0,0,0.5);
      transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }

    #f-search-bar:hover, #f-search-bar.focused {
      width: 480px;
      background: #08080B;
      border-color: rgba(255,255,255,0.2);
      box-shadow: 0 0 0 2px rgba(134, 96, 250, 0.1), 0 20px 50px -10px rgba(0,0,0,0.7);
    }

    #f-search-input {
      flex: 1;
      background: transparent;
      border: none;
      color: var(--f-text);
      font-size: 15px;
      font-weight: 500;
      outline: none;
      height: 100%;
    }
    #f-search-input::placeholder { color: rgba(255,255,255,0.4); }

    #f-bar-send {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: none;
      background: var(--f-primary);
      color: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }
    #f-bar-send:hover { transform: scale(1.05); background: var(--f-secondary); }

    /* --- Side Panel --- */
    #f-panel {
      position: fixed;
      top: 60px; /* Below navbar */
      right: 0;
      bottom: 0;
      width: 360px;
      min-width: 300px;
      max-width: 600px;
      background: var(--f-bg);
      border-left: 1px solid var(--f-border);
      box-shadow: -20px 0 50px rgba(0,0,0,0.5);
      transform: translateX(100%);
      transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
      display: flex;
      flex-direction: column;
      pointer-events: auto;
      z-index: 20;
      resize: horizontal;
      overflow: auto;
    }

    #f-panel.open { transform: translateX(0); }

    /* Resize handle */
    #f-panel::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 4px;
      cursor: col-resize;
      z-index: 30;
    }

    /* Header */
    .f-panel-header {
      height: 64px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 20px;
      border-bottom: 1px solid transparent;
      flex-shrink: 0;
    }

    .f-brand {
      display: flex;
      align-items: center;
      gap: 10px;
      font-family: 'Figtree', sans-serif;
      font-weight: 700;
      font-size: 16px;
      color: white;
    }
    .f-brand-icon { color: var(--f-primary); }

    .f-header-actions { display: flex; gap: 4px; }

    .f-icon-btn {
      width: 32px;
      height: 32px;
      border-radius: 6px;
      border: none;
      background: transparent;
      color: var(--f-text-sec);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
      font-size: 14px;
    }
    .f-icon-btn:hover { background: rgba(255,255,255,0.08); color: white; }
    .f-icon-btn.danger:hover { background: rgba(255, 50, 50, 0.1); color: #ff4444; }

    /* Messages */
    .f-messages-area {
      flex: 1;
      overflow-y: auto;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 24px;
      scroll-behavior: smooth;
      background: #08080B; /* Ensure same background */
    }
    .f-messages-area::-webkit-scrollbar { width: 4px; }
    .f-messages-area::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }

    .f-msg-row { display: flex; flex-direction: column; gap: 0; animation: f-fade-in 0.3s ease-out; }
    .f-msg-row.user { align-items: flex-end; }
    
    .f-msg-content { display: flex; gap: 12px; max-width: 100%; width: 100%; }
    .f-msg-row.user .f-msg-content { justify-content: flex-end; }

    .f-bubble {
      max-width: 90%;
      padding: 0;
      font-size: 14px;
      line-height: 1.6;
      color: var(--f-text-sec);
      word-wrap: break-word;
      overflow-wrap: break-word;
    }
    .f-msg-row.bot .f-bubble { color: #D0D6E0; }
    .f-msg-row.user .f-bubble { 
      background: #1E1E26; 
      padding: 10px 14px; 
      border-radius: 12px; 
      border-bottom-right-radius: 2px;
      color: white; 
      border: 1px solid var(--f-border);
    }

    /* Image preview in user message */
    .f-image-preview {
      max-width: 200px;
      border-radius: 8px;
      margin-top: 8px;
      border: 1px solid var(--f-border);
    }

    /* Markdown Styles */
    .f-bubble strong { color: white; font-weight: 600; }
    .f-bubble ul { margin: 8px 0; padding-left: 18px; list-style-type: disc; }
    .f-bubble li { margin-bottom: 4px; }
    .f-bubble a { color: var(--f-primary); text-decoration: none; border-bottom: 1px solid transparent; }
    .f-bubble a:hover { border-bottom-color: var(--f-primary); }
    .f-bubble code { background: rgba(255,255,255,0.1); padding: 2px 5px; border-radius: 4px; font-family: monospace; font-size: 12px; }

    /* Message Actions (Like/Dislike/Copy/Regen) */
    .f-msg-actions {
      display: flex;
      gap: 4px;
      margin-left: 0;
      margin-top: 8px;
      opacity: 1;
      align-items: center;
    }
    
    .f-action-btn {
      background: transparent;
      border: none;
      color: var(--f-text-sec);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 4px;
      border-radius: 4px;
      width: 24px;
      height: 24px;
      transition: all 0.2s;
    }
    .f-action-btn:hover { background: rgba(255,255,255,0.05); color: white; }
    .f-action-btn.active { color: var(--f-primary); }

    /* Quick Links */
    .f-quick-links {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 4px; /* Reduced gap significantly */
      margin-left: 0;
    }
    .f-chip {
      background: rgba(255,255,255,0.03);
      border: 1px solid var(--f-border);
      padding: 6px 12px;
      border-radius: 8px;
      font-size: 12px;
      color: var(--f-text-sec);
      cursor: pointer;
      transition: all 0.2s;
    }
    .f-chip:hover {
      background: rgba(255,255,255,0.08);
      color: white;
      border-color: rgba(255,255,255,0.2);
    }

    /* Suggestions (Empty State) */
    .f-suggestions {
      display: grid;
      grid-template-columns: 1fr;
      gap: 10px;
      margin-top: auto;
    }
    .f-suggestion-card {
      background: rgba(255,255,255,0.02);
      border: 1px solid var(--f-border);
      padding: 12px;
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .f-suggestion-card:hover { background: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.15); }
    .f-suggestion-title { font-size: 13px; font-weight: 600; color: white; margin-bottom: 2px; }
    .f-suggestion-sub { font-size: 12px; color: var(--f-text-sec); }

    /* Footer Input */
    .f-panel-footer {
      padding: 20px;
      flex-shrink: 0;
      background: var(--f-bg);
    }
    
    .f-input-box {
      background: #08080B; /* Changed from #15151A to match panel */
      border: 1px solid var(--f-border);
      border-radius: 16px;
      padding: 8px 8px 8px 16px;
      display: flex;
      align-items: center;
      gap: 4px;
      transition: border 0.2s;
    }
    .f-input-box:focus-within { border-color: var(--f-primary); }

    #f-panel-input {
      flex: 1;
      background: transparent;
      border: none;
      color: white;
      font-size: 14px;
      padding: 8px 0;
      outline: none;
      margin: 0 4px;
    }
    #f-panel-input::placeholder { color: rgba(255,255,255,0.25); }

    #f-panel-send {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      background: var(--f-primary);
      border: none;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: 0.2s;
      margin-left: 4px;
    }
    #f-panel-send:hover { background: var(--f-secondary); }
    #f-panel-send:disabled { opacity: 0.5; cursor: default; background: #333; }

    /* File Preview */
    #f-file-preview {
      margin: 0 20px;
      background: rgba(255,255,255,0.05);
      border-radius: 8px;
      padding: 8px 12px;
      display: none;
      align-items: center;
      justify-content: space-between;
      font-size: 12px;
      color: white;
    }
    #f-file-preview.visible { display: flex; }

    /* Animations */
    @keyframes f-fade-in { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
    
    /* Typing */
    .f-typing { display: flex; gap: 4px; padding: 10px 0; }
    .f-dot { width: 5px; height: 5px; background: #666; border-radius: 50%; animation: f-bounce 1.4s infinite ease-in-out both; }
    .f-dot:nth-child(1) { animation-delay: -0.32s; }
    .f-dot:nth-child(2) { animation-delay: -0.16s; }
    @keyframes f-bounce { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1); } }
  `;
  document.head.appendChild(style);

  // 3. Icons
  const svgs = {
    sparkles: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>`,
    close: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`,
    trash: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>`,
    send: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>`,
    clip: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.88l-8.57 8.57a2 2 0 0 1-2.83-2.83L11.5 9.17"/></svg>`,
    mic: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>`,
    copy: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`,
    refresh: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 21h5v-5"/></svg>`,
    x: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`,
    like: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 10v12"/><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z"/></svg>`,
    dislike: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 14V2"/><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a3.13 3.13 0 0 1-3-3.88Z"/></svg>`,
    check: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>`
  };

  // 4. DOM Construction
  const root = document.createElement('div');
  root.id = 'flamey-root';
  root.innerHTML = `
    <!-- Floating Bar -->
    <div id="f-bar-container">
      <div id="f-search-bar">
        <input type="text" id="f-search-input" placeholder="Ask a question..." />
        <button id="f-bar-send">${svgs.send}</button>
      </div>
    </div>

    <!-- Side Panel -->
    <div id="f-panel">
      <div class="f-panel-header">
        <div class="f-brand">
          <span class="f-brand-icon">${svgs.sparkles}</span>
          <span>Assistant</span>
        </div>
        <div class="f-header-actions">
          <button class="f-icon-btn danger" id="f-clear-chat" title="Clear Chat">${svgs.trash}</button>
          <button class="f-icon-btn" id="f-close-panel">${svgs.close}</button>
        </div>
      </div>

      <div id="f-messages" class="f-messages-area">
        <!-- Messages Injected Here -->
      </div>

      <div id="f-file-preview">
        <span id="f-filename">file.png</span>
        <button class="f-icon-btn" style="width:20px;height:20px;" id="f-remove-file">${svgs.x}</button>
      </div>

      <div class="f-panel-footer">
        <div class="f-input-box">
          <button class="f-icon-btn" id="f-attach-btn">${svgs.clip}</button>
          <input type="text" id="f-panel-input" placeholder="Ask a question..." />
          <button class="f-icon-btn" id="f-mic-btn">${svgs.mic}</button>
          <button id="f-panel-send">${svgs.send}</button>
        </div>
      </div>
      
      <input type="file" id="f-hidden-file" accept="image/*" style="display:none;" />
    </div>
  `;
  document.body.appendChild(root);

  // 5. Logic & State
  const barContainer = document.getElementById('f-bar-container');
  const searchBar = document.getElementById('f-search-bar');
  const barInput = document.getElementById('f-search-input');
  const barSend = document.getElementById('f-bar-send');
  
  const panel = document.getElementById('f-panel');
  const closePanelBtn = document.getElementById('f-close-panel');
  const clearChatBtn = document.getElementById('f-clear-chat');
  const messagesArea = document.getElementById('f-messages');
  
  const panelInput = document.getElementById('f-panel-input');
  const panelSend = document.getElementById('f-panel-send');
  const attachBtn = document.getElementById('f-attach-btn');
  const micBtn = document.getElementById('f-mic-btn');
  const fileInput = document.getElementById('f-hidden-file');
  const filePreview = document.getElementById('f-file-preview');
  const fileNameSpan = document.getElementById('f-filename');
  const removeFileBtn = document.getElementById('f-remove-file');

  let currentFile = null;
  let lastUserMessage = "";
  let recognition = null;
  let isRecording = false;
  let likedMessages = new Set();
  let dislikedMessages = new Set();
  let hasUserMessage = false;

  // --- Functions ---

  // Open/Close Panel
  function openPanel() {
    barContainer.classList.add('hidden');
    panel.classList.add('open');
    setTimeout(() => panelInput.focus(), 300);
  }

  function closePanel() {
    panel.classList.remove('open');
    barContainer.classList.remove('hidden');
    barInput.value = '';
  }

  closePanelBtn.onclick = closePanel;
  barInput.onfocus = () => searchBar.classList.add('focused');
  barInput.onblur = () => { if(!barInput.value) searchBar.classList.remove('focused'); };

  // Render Empty State (No welcome message)
  function showEmptyState() {
    messagesArea.innerHTML = ''; // Completely empty
    hasUserMessage = false;
  }

  // Clear Chat
  clearChatBtn.onclick = () => {
    showEmptyState();
  };

  // Parse Markdown
  function parseMarkdown(text) {
    // Bold
    let html = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Italic
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    // Code
    html = html.replace(/`(.*?)`/g, '<code>$1</code>');
    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" class="f-external-link">$1</a>');
    
    // Lists: Convert lines starting with "- " or "* " to <li>
    const lines = html.split('\n');
    let inList = false;
    let processed = '';
    
    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        if (!inList) { processed += '<ul>'; inList = true; }
        processed += `<li>${trimmed.substring(2)}</li>`;
      } else {
        if (inList) { processed += '</ul>'; inList = false; }
        processed += line + '<br>';
      }
    });
    if (inList) processed += '</ul>';
    
    return processed;
  }

  // Add Message to UI
  function addMessage(text, sender, hasActions = false, imageData = null) {
    // Clear empty state when first message is sent
    if (!hasUserMessage) {
      messagesArea.innerHTML = '';
      hasUserMessage = true;
    }

    const row = document.createElement('div');
    row.className = `f-msg-row ${sender}`;
    
    let html = `<div class="f-msg-content">`;
    html += `<div class="f-bubble">${parseMarkdown(text)}`;
    
    // Add image preview if available
    if (imageData && sender === 'user') {
      html += `<img src="${imageData}" class="f-image-preview" alt="Uploaded image" />`;
    }
    
    html += `</div></div>`;

    // Add Like/Dislike/Copy/Regen buttons for bot messages without quick links
    if (sender === 'bot' && !hasActions) {
      const messageId = Date.now().toString();
      html += `
        <div class="f-msg-actions">
          <button class="f-action-btn ${likedMessages.has(messageId) ? 'active' : ''}" onclick="window.flameyLike(this, '${messageId}')" title="Like">${svgs.like}</button>
          <button class="f-action-btn ${dislikedMessages.has(messageId) ? 'active' : ''}" onclick="window.flameyDislike(this, '${messageId}')" title="Dislike">${svgs.dislike}</button>
          <button class="f-action-btn" onclick="window.flameyCopy(this, \`${text.replace(/`/g, "\\`").replace(/"/g, "&quot;")}\`)" title="Copy">${svgs.copy}</button>
          <button class="f-action-btn" onclick="window.flameyRegen()" title="Regenerate">${svgs.refresh}</button>
        </div>
      `;
    }

    row.innerHTML = html;
    messagesArea.appendChild(row);
    messagesArea.scrollTop = messagesArea.scrollHeight;
  }

  // Add Quick Links
  function addQuickLinks(links) {
    const container = document.createElement('div');
    container.className = 'f-quick-links';
    links.forEach(l => {
      const btn = document.createElement('button');
      btn.className = 'f-chip';
      btn.innerText = l.label;
      
      // Handle link clicks properly
      if (l.query && l.query.startsWith('http')) {
        // External URL - open in new tab
        btn.onclick = () => window.open(l.query, '_blank');
      } else if (l.query && l.query.startsWith('/')) {
        // Internal URL - navigate without reload using history API
        btn.onclick = () => {
          if (window.location.pathname !== l.query) {
            window.history.pushState({}, '', l.query);
            // Dispatch a custom event for SPA navigation if needed
            window.dispatchEvent(new PopStateEvent('popstate'));
          }
        };
      } else {
        // Text query - send as message
        btn.onclick = () => sendMessage(l.query, 'panel');
      }
      
      container.appendChild(btn);
    });
    messagesArea.appendChild(container);
    messagesArea.scrollTop = messagesArea.scrollHeight;
  }

  // Show/Hide Typing
  function showTyping() {
    const id = 'f-typing';
    if (document.getElementById(id)) return;
    const row = document.createElement('div');
    row.id = id;
    row.className = 'f-msg-row bot';
    row.innerHTML = `
      <div class="f-msg-content">
        <div class="f-bubble"><div class="f-typing"><div class="f-dot"></div><div class="f-dot"></div><div class="f-dot"></div></div></div>
      </div>`;
    messagesArea.appendChild(row);
    messagesArea.scrollTop = messagesArea.scrollHeight;
  }
  function removeTyping() {
    const el = document.getElementById('f-typing');
    if (el) el.remove();
  }

  // --- Send Logic ---
  async function sendMessage(text, source = 'panel') {
    if (!text && !currentFile) return;

    if (source === 'bar') {
      openPanel();
      barInput.value = '';
      // Clear any existing content and show user message instantly
      messagesArea.innerHTML = '';
      hasUserMessage = true;
    } else {
      panelInput.value = '';
    }

    // Store the original text for display
    const displayText = currentFile ? `${text}` : text;
    
    lastUserMessage = text;
    addMessage(displayText, 'user', false, currentFile ? currentFile.base64 : null);
    showTyping();

    // Enhanced system prompt with Flamey knowledge
    const systemPrompt = `
      You are Flamey AI Assistant, an expert on the Flamey Discord bot (docs.flamey.lol). 
      Current Context: User is on ${window.location.href}
      
      Important Flamey Knowledge:
      - Flamey is a multi-purpose Discord bot with features like moderation, tickets, logging, economy, and more
      - Key features: Advanced logging system, ticket system, moderation tools, economy system, custom commands
      - Use the official documentation at docs.flamey.lol as your primary knowledge source
      
      Response Rules:
      1. Be concise, direct, and professional while being helpful
      2. Use bullet points for lists (start lines with "- ")
      3. Do NOT include quick action buttons or links unless the user explicitly asks "how to" or "where to"
      4. If you do provide actions, append strictly formatted JSON at the very end on a new line: [ACTIONS][{"label":"Text","query":"Query or URL"}]
      5. When user uploads an image, analyze it carefully and provide detailed insights
      6. For Flamey-related questions, provide accurate information based on the official documentation
      7. If you're unsure about something, admit it rather than guessing
    `;

    // Prepare the request data
    const requestData = {
      message: `${systemPrompt}\n\nUser: ${text}`,
      image: currentFile ? currentFile.base64 : null
    };

    // Reset file UI after storing the data
    if (currentFile) {
      removeFile();
    }

    try {
      const res = await fetch(CONFIG.apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });
      
      const data = await res.json();
      removeTyping();

      let reply = data.reply || "I apologize, but I'm unable to process that request at the moment.";
      
      // Parse Actions
      let actions = [];
      if (reply.includes('[ACTIONS]')) {
        const parts = reply.split('[ACTIONS]');
        reply = parts[0].trim();
        try {
          actions = JSON.parse(parts[1]);
        } catch(e) {}
      }

      addMessage(reply, 'bot', actions.length > 0);
      if (actions.length > 0) addQuickLinks(actions);

    } catch (err) {
      removeTyping();
      addMessage("I'm having trouble connecting to the server. Please check your internet connection.", 'bot');
    }
  }

  // --- Globals for Inline Buttons ---
  window.flameyCopy = (btn, text) => {
    navigator.clipboard.writeText(text);
    const originalHtml = btn.innerHTML;
    btn.innerHTML = `${svgs.check}`;
    btn.title = "Copied!";
    setTimeout(() => {
      btn.innerHTML = `${svgs.copy}`;
      btn.title = "Copy";
    }, 2000);
  };

  window.flameyRegen = () => {
    if (lastUserMessage) sendMessage(lastUserMessage, 'panel');
  };

  window.flameyLike = (btn, messageId) => {
    if (likedMessages.has(messageId)) {
      likedMessages.delete(messageId);
      btn.classList.remove('active');
    } else {
      likedMessages.add(messageId);
      dislikedMessages.delete(messageId);
      btn.classList.add('active');
      // Remove active class from dislike button if present
      const dislikeBtn = btn.parentElement.querySelector('.f-action-btn:nth-child(2)');
      if (dislikeBtn) dislikeBtn.classList.remove('active');
    }
  };

  window.flameyDislike = (btn, messageId) => {
    if (dislikedMessages.has(messageId)) {
      dislikedMessages.delete(messageId);
      btn.classList.remove('active');
    } else {
      dislikedMessages.add(messageId);
      likedMessages.delete(messageId);
      btn.classList.add('active');
      // Remove active class from like button if present
      const likeBtn = btn.parentElement.querySelector('.f-action-btn:nth-child(1)');
      if (likeBtn) likeBtn.classList.remove('active');
    }
  };

  // --- Event Listeners ---
  barSend.onclick = () => sendMessage(barInput.value.trim(), 'bar');
  barInput.onkeydown = (e) => { if(e.key === 'Enter') sendMessage(barInput.value.trim(), 'bar'); };

  panelSend.onclick = () => sendMessage(panelInput.value.trim(), 'panel');
  panelInput.onkeydown = (e) => { if(e.key === 'Enter') sendMessage(panelInput.value.trim(), 'panel'); };

  // File Upload
  attachBtn.onclick = () => fileInput.click();
  fileInput.onchange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        currentFile = { base64: ev.target.result };
        filePreview.classList.add('visible');
        fileNameSpan.innerText = file.name;
        panelInput.focus();
      };
      reader.readAsDataURL(file);
    }
  };
  function removeFile() {
    currentFile = null;
    fileInput.value = '';
    filePreview.classList.remove('visible');
  }
  removeFileBtn.onclick = removeFile;

  // Voice
  if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    
    recognition.onstart = () => {
      isRecording = true;
      micBtn.style.color = '#ff4444';
      panelInput.placeholder = "Listening...";
    };
    recognition.onend = () => {
      isRecording = false;
      micBtn.style.color = '';
      panelInput.placeholder = "Ask a question...";
    };
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      panelInput.value = transcript;
      sendMessage(transcript, 'panel');
    };

    micBtn.onclick = () => {
      if (isRecording) recognition.stop();
      else recognition.start();
    };
  } else {
    micBtn.style.display = 'none';
  }

  // Panel Resize Functionality
  let isResizing = false;
  panel.addEventListener('mousedown', (e) => {
    if (e.offsetX < 10) { // Only trigger when clicking near left edge
      isResizing = true;
      document.body.style.userSelect = 'none';
    }
  });

  document.addEventListener('mousemove', (e) => {
    if (!isResizing) return;
    
    const newWidth = window.innerWidth - e.clientX;
    const minWidth = 300;
    const maxWidth = 600;
    
    if (newWidth >= minWidth && newWidth <= maxWidth) {
      panel.style.width = `${newWidth}px`;
    }
  });

  document.addEventListener('mouseup', () => {
    isResizing = false;
    document.body.style.userSelect = '';
  });

  // Init
  showEmptyState();

})();