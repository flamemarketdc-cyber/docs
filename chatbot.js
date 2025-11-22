(function() {
  // 1. Load Fonts (Inter & Figtree) if not already present
  if (!document.getElementById('flamey-fonts')) {
    const link = document.createElement('link');
    link.id = 'flamey-fonts';
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Figtree:wght@400;600;800&family=Inter:wght@400;500;600&display=swap';
    document.head.appendChild(link);
  }

  // 2. Inject CSS Styles (The Flamey Design System)
  const style = document.createElement('style');
  style.innerHTML = `
    :root {
      --f-primary: #8660FA;
      --f-secondary: #5E38C2;
      --f-bg: #0B0B15;
      --f-surface: #151521;
      --f-text: #EAF6FF;
      --f-text-sec: #B0BECF;
      --f-border: rgba(255, 255, 255, 0.1);
      --f-glass: rgba(11, 11, 21, 0.85);
    }

    #flamey-root {
      font-family: 'Inter', sans-serif;
      z-index: 99999;
      position: fixed;
      bottom: 20px;
      right: 20px;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }

    /* Floating Action Button (The Launcher) */
    #flamey-launcher {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      border: none;
      cursor: pointer;
      background: linear-gradient(135deg, var(--f-primary), var(--f-secondary));
      box-shadow: 0 0 15px rgba(134, 96, 250, 0.3), 0 4px 12px rgba(0, 0, 0, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s ease;
    }

    #flamey-launcher:hover {
      transform: scale(1.1);
      box-shadow: 0 0 25px rgba(134, 96, 250, 0.5), 0 8px 20px rgba(0, 0, 0, 0.3);
    }

    #flamey-launcher:active {
      transform: scale(0.95);
    }

    /* Main Chat Panel */
    #flamey-panel {
      width: 380px;
      height: 600px;
      max-height: 80vh;
      background: var(--f-glass);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid var(--f-border);
      border-radius: 20px;
      box-shadow: 0 20px 50px rgba(0,0,0,0.5);
      display: flex;
      flex-direction: column;
      margin-bottom: 16px;
      opacity: 0;
      transform: translateY(20px) scale(0.95);
      transform-origin: bottom right;
      transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
      pointer-events: none;
      overflow: hidden;
    }

    #flamey-panel.open {
      opacity: 1;
      transform: translateY(0) scale(1);
      pointer-events: all;
    }

    /* Header */
    .f-header {
      padding: 16px;
      border-bottom: 1px solid var(--f-border);
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: rgba(255,255,255,0.02);
    }

    .f-title {
      font-family: 'Figtree', sans-serif;
      font-weight: 700;
      color: var(--f-text);
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .f-close-btn {
      background: transparent;
      border: none;
      color: var(--f-text-sec);
      cursor: pointer;
      padding: 4px;
      border-radius: 50%;
      transition: all 0.2s;
      display: flex;
    }
    .f-close-btn:hover {
      background: rgba(255,255,255,0.1);
      color: white;
    }

    /* Messages Area */
    #f-messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      scrollbar-width: thin;
      scrollbar-color: rgba(255,255,255,0.1) transparent;
    }

    #f-messages::-webkit-scrollbar {
      width: 6px;
    }
    #f-messages::-webkit-scrollbar-thumb {
      background-color: rgba(255,255,255,0.1);
      border-radius: 10px;
    }

    .f-msg {
      max-width: 85%;
      padding: 10px 14px;
      border-radius: 14px;
      font-size: 14px;
      line-height: 1.5;
      animation: f-fade-in 0.3s ease-out forwards;
    }

    .f-msg-bot {
      align-self: flex-start;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--f-border);
      border-bottom-left-radius: 2px;
      color: var(--f-text);
    }

    .f-msg-user {
      align-self: flex-end;
      background: linear-gradient(135deg, var(--f-primary), var(--f-secondary));
      color: white;
      border-bottom-right-radius: 2px;
      box-shadow: 0 4px 12px rgba(134, 96, 250, 0.2);
    }

    /* Input Area */
    .f-footer {
      padding: 16px;
      border-top: 1px solid var(--f-border);
      display: flex;
      align-items: center;
      gap: 8px;
      background: rgba(0,0,0,0.2);
    }

    .f-btn-icon {
      background: transparent;
      border: none;
      color: var(--f-text-sec);
      cursor: pointer;
      padding: 8px;
      border-radius: 50%;
      transition: 0.2s;
      display: flex;
    }
    .f-btn-icon:hover {
      color: white;
      background: rgba(255,255,255,0.05);
    }

    #f-input {
      flex: 1;
      background: rgba(255,255,255,0.05);
      border: 1px solid transparent;
      border-radius: 12px;
      padding: 10px 14px;
      color: white;
      font-size: 14px;
      outline: none;
      transition: all 0.2s;
    }
    #f-input:focus {
      border-color: var(--f-primary);
      background: rgba(0,0,0,0.4);
    }
    #f-input::placeholder {
      color: rgba(255,255,255,0.3);
    }

    #f-send {
      background: var(--f-primary);
      color: white;
      border: none;
      border-radius: 10px;
      padding: 10px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: 0.2s;
    }
    #f-send:hover {
      transform: translateY(-1px);
      filter: brightness(1.1);
    }
    #f-send:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    /* Animations */
    @keyframes f-fade-in {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* Typing Indicator */
    .f-typing {
      display: flex;
      gap: 4px;
      padding: 12px;
      align-self: flex-start;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 14px;
      border-bottom-left-radius: 2px;
    }
    .f-dot {
      width: 6px;
      height: 6px;
      background: var(--f-text-sec);
      border-radius: 50%;
      animation: f-bounce 1.4s infinite ease-in-out both;
    }
    .f-dot:nth-child(1) { animation-delay: -0.32s; }
    .f-dot:nth-child(2) { animation-delay: -0.16s; }
    @keyframes f-bounce {
      0%, 80%, 100% { transform: scale(0); }
      40% { transform: scale(1); }
    }
  `;
  document.head.appendChild(style);

  // 3. SVGs (Taken from source)
  const icons = {
    chat: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>`,
    close: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`,
    send: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`,
    mic: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>`,
    paperclip: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.88l-8.57 8.57a2 2 0 0 1-2.83-2.83L11.5 9.17"/></svg>`
  };

  // 4. HTML Structure
  const root = document.createElement('div');
  root.id = 'flamey-root';
  root.innerHTML = `
    <div id="flamey-panel">
      <div class="f-header">
        <div class="f-title">
          ${icons.chat}
          <span>Flamey Assistant</span>
        </div>
        <button class="f-close-btn" id="f-close">${icons.close}</button>
      </div>
      <div id="f-messages">
        <div class="f-msg f-msg-bot">
          Hi there! I'm Flamey Assistant. How can I help you navigate the site today?
        </div>
      </div>
      <div class="f-footer">
        <button class="f-btn-icon" id="f-attach">${icons.paperclip}</button>
        <button class="f-btn-icon" id="f-mic">${icons.mic}</button>
        <input type="text" id="f-input" placeholder="Ask something..." />
        <button id="f-send">${icons.send}</button>
      </div>
    </div>
    <button id="flamey-launcher">
      ${icons.chat}
    </button>
  `;
  document.body.appendChild(root);

  // 5. Logic
  const launcher = document.getElementById('flamey-launcher');
  const panel = document.getElementById('flamey-panel');
  const closeBtn = document.getElementById('f-close');
  const sendBtn = document.getElementById('f-send');
  const input = document.getElementById('f-input');
  const messagesContainer = document.getElementById('f-messages');
  const micBtn = document.getElementById('f-mic');
  const attachBtn = document.getElementById('f-attach');

  let isOpen = false;

  // Toggle Panel
  function togglePanel() {
    isOpen = !isOpen;
    if (isOpen) {
      panel.classList.add('open');
      // Change launcher icon to X
      launcher.innerHTML = icons.close;
      setTimeout(() => input.focus(), 100);
    } else {
      panel.classList.remove('open');
      // Change launcher icon back to Chat
      launcher.innerHTML = icons.chat;
    }
  }

  launcher.addEventListener('click', togglePanel);
  closeBtn.addEventListener('click', () => {
    if (isOpen) togglePanel();
  });

  // Helper: Add Message
  function addMessage(text, sender) {
    const div = document.createElement('div');
    div.className = `f-msg f-msg-${sender}`;
    div.innerHTML = text;
    messagesContainer.appendChild(div);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  // Helper: Show Typing
  let typingElement = null;
  function showTyping() {
    if (typingElement) return;
    typingElement = document.createElement('div');
    typingElement.className = 'f-typing';
    typingElement.innerHTML = `<div class="f-dot"></div><div class="f-dot"></div><div class="f-dot"></div>`;
    messagesContainer.appendChild(typingElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  function hideTyping() {
    if (typingElement) {
      typingElement.remove();
      typingElement = null;
    }
  }

  // Send Logic
  async function handleSend() {
    const text = input.value.trim();
    if (!text) return;

    // Add User Message
    addMessage(text, 'user');
    input.value = '';
    showTyping();

    // Simulate network request (Replace with your fetch logic)
    try {
      // Example Fetch:
      const res = await fetch("https://chatbot-for-mintlify.vercel.app/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      
      hideTyping();
      addMessage(data.reply || "I'm just a demo right now!", 'bot');

    } catch (err) {
      hideTyping();
      addMessage("Sorry, I'm having trouble connecting right now.", 'bot');
    }
  }

  sendBtn.addEventListener('click', handleSend);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleSend();
  });

  // Placeholders for Mic/Attach
  micBtn.addEventListener('click', () => alert('Voice input coming soon!'));
  attachBtn.addEventListener('click', () => alert('File upload coming soon!'));

})();