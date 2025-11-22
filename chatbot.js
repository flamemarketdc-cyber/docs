(function() {
  // --- CONFIGURATION ---
  const CONFIG = {
    botName: "Flamey Assistant",
    botAvatar: "https://i.postimg.cc/bJBHPq11/Flamey.png", // Replace with actual URL
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
      --f-bg: #0B0B15;
      --f-glass: rgba(11, 11, 21, 0.7);
      --f-glass-border: rgba(255, 255, 255, 0.08);
      --f-text: #EAF6FF;
      --f-text-sec: #B0BECF;
    }

    #flamey-root {
      font-family: 'Inter', sans-serif;
      z-index: 2147483647; /* Max z-index */
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 0; /* Allow clicking through when idle */
      pointer-events: none;
    }

    /* --- Floating Search Bar --- */
    #f-bar-container {
      position: fixed;
      bottom: 40px;
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
      width: 360px;
      height: 60px;
      background: rgba(15, 15, 25, 0.6);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid var(--f-glass-border);
      border-radius: 999px;
      display: flex;
      align-items: center;
      padding: 0 8px 0 24px;
      box-shadow: 0 10px 40px -10px rgba(0,0,0,0.5);
      transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      opacity: 0.8;
    }

    #f-search-bar:hover {
      transform: scale(1.02);
      opacity: 1;
      border-color: rgba(255,255,255,0.15);
    }

    #f-search-bar.focused {
      width: 520px;
      opacity: 1;
      background: rgba(15, 15, 25, 0.85);
      border-color: var(--f-primary);
      box-shadow: 0 0 0 2px rgba(134, 96, 250, 0.2), 0 20px 50px -10px rgba(0,0,0,0.6);
    }

    #f-search-input {
      flex: 1;
      background: transparent;
      border: none;
      color: var(--f-text);
      font-size: 16px;
      font-weight: 500;
      outline: none;
      height: 100%;
    }
    #f-search-input::placeholder { color: rgba(255,255,255,0.3); }

    #f-bar-actions {
      display: flex;
      gap: 8px;
      padding-left: 12px;
    }

    .f-icon-btn {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      border: none;
      background: transparent;
      color: var(--f-text-sec);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }
    .f-icon-btn:hover {
      background: rgba(255,255,255,0.1);
      color: var(--f-text);
    }

    #f-bar-send {
      background: var(--f-primary);
      color: white;
    }
    #f-bar-send:hover {
      background: var(--f-secondary);
      transform: scale(1.05);
    }

    /* --- Side Panel --- */
    #f-panel {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      width: 420px;
      max-width: 100vw;
      background: rgba(10, 10, 16, 0.95);
      border-left: 1px solid var(--f-glass-border);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      box-shadow: -20px 0 50px rgba(0,0,0,0.5);
      transform: translateX(100%);
      transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
      display: flex;
      flex-direction: column;
      pointer-events: auto;
      z-index: 20;
    }

    #f-panel.open {
      transform: translateX(0);
    }

    .f-panel-header {
      height: 70px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 24px;
      border-bottom: 1px solid var(--f-glass-border);
    }

    .f-brand {
      display: flex;
      align-items: center;
      gap: 12px;
      font-family: 'Figtree', sans-serif;
      font-weight: 700;
      font-size: 18px;
      color: white;
    }
    .f-brand img { width: 28px; height: 28px; border-radius: 6px; }

    .f-messages-area {
      flex: 1;
      overflow-y: auto;
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 20px;
      scroll-behavior: smooth;
    }
    .f-messages-area::-webkit-scrollbar { width: 6px; }
    .f-messages-area::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }

    /* Message Bubbles */
    .f-msg-row { display: flex; gap: 12px; animation: f-slide-up 0.3s ease-out; }
    .f-msg-row.user { justify-content: flex-end; }
    
    .f-avatar {
      width: 32px; height: 32px; border-radius: 50%;
      background: #1E1E2E;
      display: flex; align-items: center; justify-content: center;
      font-size: 14px; flex-shrink: 0;
    }
    .f-avatar img { width: 100%; height: 100%; border-radius: 50%; }

    .f-bubble {
      max-width: 85%;
      padding: 12px 16px;
      border-radius: 18px;
      font-size: 15px;
      line-height: 1.5;
      position: relative;
      word-wrap: break-word;
    }
    
    .f-msg-row.bot .f-bubble {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid var(--f-glass-border);
      border-top-left-radius: 4px;
      color: var(--f-text-sec);
    }
    .f-msg-row.bot .f-bubble b, .f-msg-row.bot .f-bubble strong { color: white; font-weight: 600; }
    .f-msg-row.bot .f-bubble a { color: var(--f-primary); text-decoration: none; }
    .f-msg-row.bot .f-bubble a:hover { text-decoration: underline; }

    .f-msg-row.user .f-bubble {
      background: linear-gradient(135deg, var(--f-primary), var(--f-secondary));
      color: white;
      border-bottom-right-radius: 4px;
      box-shadow: 0 4px 15px rgba(134, 96, 250, 0.2);
    }

    /* Quick Links / Chips */
    .f-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 8px;
      margin-left: 44px; /* Align with text, offset avatar */
    }
    .f-chip {
      background: rgba(255,255,255,0.05);
      border: 1px solid var(--f-glass-border);
      padding: 6px 12px;
      border-radius: 8px;
      font-size: 12px;
      color: var(--f-text-sec);
      cursor: pointer;
      transition: all 0.2s;
    }
    .f-chip:hover {
      background: rgba(255,255,255,0.1);
      color: white;
      border-color: var(--f-primary);
    }

    /* Panel Input Area */
    .f-panel-input-container {
      padding: 20px;
      border-top: 1px solid var(--f-glass-border);
      background: rgba(0,0,0,0.2);
    }
    .f-input-wrapper {
      background: rgba(255,255,255,0.05);
      border: 1px solid transparent;
      border-radius: 16px;
      padding: 8px;
      display: flex;
      align-items: flex-end;
      transition: 0.2s;
    }
    .f-input-wrapper:focus-within {
      border-color: var(--f-primary);
      background: rgba(255,255,255,0.08);
    }
    
    #f-panel-textarea {
      flex: 1;
      background: transparent;
      border: none;
      color: white;
      font-family: inherit;
      font-size: 14px;
      padding: 10px;
      resize: none;
      max-height: 100px;
      outline: none;
    }
    #f-panel-textarea::placeholder { color: rgba(255,255,255,0.3); }

    /* Upload Preview */
    #f-file-preview {
      display: none;
      padding: 8px 20px;
      background: rgba(0,0,0,0.3);
      font-size: 12px;
      color: var(--f-text-sec);
      border-top: 1px solid var(--f-glass-border);
      align-items: center;
      justify-content: space-between;
    }
    #f-file-preview.visible { display: flex; }

    /* Animations */
    @keyframes f-slide-up {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes f-pulse {
      0% { box-shadow: 0 0 0 0 rgba(134, 96, 250, 0.4); }
      70% { box-shadow: 0 0 0 10px rgba(134, 96, 250, 0); }
      100% { box-shadow: 0 0 0 0 rgba(134, 96, 250, 0); }
    }
    
    .recording {
      animation: f-pulse 2s infinite;
      color: #ff4444 !important;
    }

    /* Typing Dots */
    .f-typing { display: flex; gap: 4px; padding: 4px 0; }
    .f-dot {
      width: 6px; height: 6px; background: var(--f-text-sec); border-radius: 50%;
      animation: f-bounce 1.4s infinite ease-in-out both;
    }
    .f-dot:nth-child(1) { animation-delay: -0.32s; }
    .f-dot:nth-child(2) { animation-delay: -0.16s; }
    @keyframes f-bounce { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1); } }
  `;
  document.head.appendChild(style);

  // 3. Icons
  const svgs = {
    send: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`,
    mic: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>`,
    clip: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.88l-8.57 8.57a2 2 0 0 1-2.83-2.83L11.5 9.17"/></svg>`,
    close: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`,
    x: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`,
    logo: CONFIG.botAvatar
  };

  // 4. DOM Structure
  const root = document.createElement('div');
  root.id = 'flamey-root';
  root.innerHTML = `
    <!-- Floating Search Bar -->
    <div id="f-bar-container">
      <div id="f-search-bar">
        <input type="text" id="f-search-input" placeholder="Ask a question..." />
        <div id="f-bar-actions">
          <button class="f-icon-btn" id="f-bar-send">${svgs.send}</button>
        </div>
      </div>
    </div>

    <!-- Side Chat Panel -->
    <div id="f-panel">
      <div class="f-panel-header">
        <div class="f-brand">
          <img src="${svgs.logo}" alt="AI" />
          <span>${CONFIG.botName}</span>
        </div>
        <button class="f-icon-btn" id="f-panel-close">${svgs.close}</button>
      </div>
      
      <div class="f-messages-area" id="f-messages">
        <!-- Messages go here -->
      </div>

      <div id="f-file-preview">
        <span id="f-filename">image.png</span>
        <button class="f-icon-btn" style="width:20px;height:20px;" id="f-remove-file">${svgs.x}</button>
      </div>

      <div class="f-panel-input-container">
        <div class="f-input-wrapper">
          <button class="f-icon-btn" id="f-panel-upload">${svgs.clip}</button>
          <textarea id="f-panel-textarea" rows="1" placeholder="Type your message..."></textarea>
          <button class="f-icon-btn" id="f-panel-mic">${svgs.mic}</button>
          <button class="f-icon-btn" id="f-panel-send" style="color:var(--f-primary);">${svgs.send}</button>
        </div>
      </div>
      
      <input type="file" id="f-hidden-file-input" accept="image/*" style="display:none;" />
    </div>
  `;
  document.body.appendChild(root);

  // 5. State & Elements
  const barContainer = document.getElementById('f-bar-container');
  const searchBar = document.getElementById('f-search-bar');
  const searchInput = document.getElementById('f-search-input');
  const barSendBtn = document.getElementById('f-bar-send');
  
  const panel = document.getElementById('f-panel');
  const panelCloseBtn = document.getElementById('f-panel-close');
  const messagesArea = document.getElementById('f-messages');
  const panelTextarea = document.getElementById('f-panel-textarea');
  const panelSendBtn = document.getElementById('f-panel-send');
  const panelMicBtn = document.getElementById('f-panel-mic');
  const panelUploadBtn = document.getElementById('f-panel-upload');
  const hiddenFileInput = document.getElementById('f-hidden-file-input');
  const filePreview = document.getElementById('f-file-preview');
  const filenameSpan = document.getElementById('f-filename');
  const removeFileBtn = document.getElementById('f-remove-file');

  let currentFile = null; // { base64, type, name }
  let isRecording = false;
  let recognition = null;

  // --- Logic: Search Bar Effects ---
  searchInput.addEventListener('focus', () => searchBar.classList.add('focused'));
  searchInput.addEventListener('blur', () => {
    if (!searchInput.value.trim()) searchBar.classList.remove('focused');
  });

  // --- Logic: Transitions ---
  function openPanel() {
    barContainer.classList.add('hidden');
    panel.classList.add('open');
    // If we opened from bar, clear it and focus panel input
    setTimeout(() => {
      searchBar.classList.remove('focused');
      panelTextarea.focus();
    }, 300);
  }

  function closePanel() {
    panel.classList.remove('open');
    barContainer.classList.remove('hidden');
    searchInput.value = ''; // Reset bar
  }

  panelCloseBtn.addEventListener('click', closePanel);

  // --- Logic: Messaging ---
  
  // Markdown Parser
  function parseMarkdown(text) {
    let html = text
      .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>') // Bold
      .replace(/\*(.*?)\*/g, '<i>$1</i>') // Italic
      .replace(/`(.*?)`/g, '<code style="background:rgba(255,255,255,0.1);padding:2px 4px;border-radius:4px;">$1</code>') // Inline Code
      .replace(/\n/g, '<br>'); // Newlines
    
    // Links [Text](url)
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
    return html;
  }

  function addMessage(text, sender) {
    const row = document.createElement('div');
    row.className = `f-msg-row ${sender}`;
    
    const content = sender === 'bot' 
      ? `<div class="f-avatar"><img src="${svgs.logo}"></div>
         <div class="f-bubble">${parseMarkdown(text)}</div>`
      : `<div class="f-bubble">${parseMarkdown(text)}</div>`;
      
    row.innerHTML = content;
    messagesArea.appendChild(row);
    messagesArea.scrollTop = messagesArea.scrollHeight;
  }

  function addQuickLinks() {
    const linksContainer = document.createElement('div');
    linksContainer.className = 'f-chips';
    
    // Context-aware suggestions
    const suggestions = [
      { label: "What can you do?", query: "What are your features?" },
      { label: "Pricing", query: "How much does Flamey cost?" },
      { label: "Dashboard", query: "Take me to the dashboard" },
      { label: "Docs", query: "Where is the documentation?" }
    ];

    suggestions.forEach(s => {
      const chip = document.createElement('button');
      chip.className = 'f-chip';
      chip.innerText = s.label;
      chip.onclick = () => handleMessageSubmit(s.query, 'panel');
      linksContainer.appendChild(chip);
    });

    messagesArea.appendChild(linksContainer);
    messagesArea.scrollTop = messagesArea.scrollHeight;
  }

  function showTyping() {
    const id = 'f-typing-indicator';
    if (document.getElementById(id)) return;
    
    const row = document.createElement('div');
    row.id = id;
    row.className = 'f-msg-row bot';
    row.innerHTML = `
      <div class="f-avatar"><img src="${svgs.logo}"></div>
      <div class="f-bubble">
        <div class="f-typing">
          <div class="f-dot"></div><div class="f-dot"></div><div class="f-dot"></div>
        </div>
      </div>
    `;
    messagesArea.appendChild(row);
    messagesArea.scrollTop = messagesArea.scrollHeight;
  }

  function removeTyping() {
    const el = document.getElementById('f-typing-indicator');
    if (el) el.remove();
  }

  async function handleMessageSubmit(text, source) {
    if (!text && !currentFile) return;

    if (source === 'bar') {
      openPanel();
      // Small delay to make transition feel natural before adding message
      await new Promise(r => setTimeout(r, 400));
    }

    // Add User Message
    addMessage(text, 'user');
    
    // Clear inputs
    searchInput.value = '';
    panelTextarea.value = '';
    clearFile(); // Reset file after send

    showTyping();

    // Prepare Context
    const context = `[Context: Current User URL is ${window.location.href}]`;
    const finalPrompt = `${context}\n\n${text}`;

    try {
      // Replace with your actual fetch
      const res = await fetch(CONFIG.apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: finalPrompt }),
      });
      
      const data = await res.json();
      removeTyping();
      
      const replyText = data.reply || "I'm sorry, I couldn't process that request right now.";
      addMessage(replyText, 'bot');
      
      // Always append quick links for engagement
      addQuickLinks();

    } catch (err) {
      removeTyping();
      addMessage("I'm having trouble reaching the server. Please try again later.", 'bot');
    }
  }

  // --- Event Listeners ---

  // 1. Send from Bar
  barSendBtn.onclick = () => handleMessageSubmit(searchInput.value.trim(), 'bar');
  searchInput.onkeydown = (e) => {
    if (e.key === 'Enter') handleMessageSubmit(searchInput.value.trim(), 'bar');
  };

  // 2. Send from Panel
  panelSendBtn.onclick = () => handleMessageSubmit(panelTextarea.value.trim(), 'panel');
  panelTextarea.onkeydown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleMessageSubmit(panelTextarea.value.trim(), 'panel');
    }
  };

  // 3. Auto-resize textarea
  panelTextarea.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
    if(this.value === '') this.style.height = 'auto';
  });

  // 4. File Upload Logic
  panelUploadBtn.onclick = () => hiddenFileInput.click();
  
  hiddenFileInput.onchange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        currentFile = {
          name: file.name,
          type: file.type,
          base64: ev.target.result
        };
        // Show Preview
        filenameSpan.innerText = file.name;
        filePreview.classList.add('visible');
        panelTextarea.focus();
      };
      reader.readAsDataURL(file);
    }
  };

  function clearFile() {
    currentFile = null;
    hiddenFileInput.value = '';
    filePreview.classList.remove('visible');
  }
  removeFileBtn.onclick = clearFile;

  // 5. Voice Logic
  if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      isRecording = true;
      panelMicBtn.classList.add('recording');
    };
    
    recognition.onend = () => {
      isRecording = false;
      panelMicBtn.classList.remove('recording');
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      panelTextarea.value += transcript;
      panelTextarea.focus();
    };

    panelMicBtn.onclick = () => {
      if (isRecording) recognition.stop();
      else recognition.start();
    };
  } else {
    panelMicBtn.style.display = 'none'; // Hide if not supported
  }

  // --- Initial Welcome ---
  setTimeout(() => {
    if (messagesArea.children.length === 0) {
      addMessage("Hi! I'm **Flamey Assistant**. I can help you with features, pricing, or setting up your bot. How can I help today?", 'bot');
      addQuickLinks();
    }
  }, 500);

})();