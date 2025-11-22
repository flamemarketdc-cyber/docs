window.addEventListener("load", () => {
  if (document.getElementById("floating-chat-bar")) return;

  // Floating bottom bar
  const floatingBar = document.createElement("div");
  floatingBar.id = "floating-chat-bar";
  floatingBar.innerHTML = `
    <input id="chat-input-bar" placeholder="Ask a question..." />
    <button id="chat-send-btn">➤</button>
  `;
  document.body.appendChild(floatingBar);

  // Chat panel
  const chatPanel = document.createElement("div");
  chatPanel.id = "chat-panel";
  chatPanel.innerHTML = `
    <div id="chat-header">
      Flamey Chatbot
      <button id="chat-close-btn">✖</button>
    </div>
    <div id="chat-messages"></div>
    <div id="chat-actions">
      <input type="text" id="chat-box" placeholder="Type your message..." />
      <button id="chat-send">Send</button>
      <button id="chat-voice">🎤</button>
      <button id="chat-upload">📎</button>
    </div>
  `;
  document.body.appendChild(chatPanel);

  const messages = chatPanel.querySelector("#chat-messages");
  const inputBar = floatingBar.querySelector("#chat-input-bar");
  const panelInput = chatPanel.querySelector("#chat-box");

  // Add styles
  const style = document.createElement("style");
  style.innerHTML = `
    /* Floating Bar */
    #floating-chat-bar {
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      width: 320px;
      background: rgba(20, 20, 30, 0.85);
      backdrop-filter: blur(12px);
      border-radius: 50px;
      display: flex;
      align-items: center;
      padding: 10px 15px;
      box-shadow: 0 8px 20px rgba(0,0,0,0.4);
      z-index: 9999;
    }
    #floating-chat-bar input {
      flex: 1;
      background: transparent;
      border: none;
      outline: none;
      color: #fff;
      font-size: 14px;
      padding: 8px;
      border-radius: 50px;
    }
    #floating-chat-bar button {
      background: #7C3AED;
      border: none;
      color: #fff;
      font-size: 16px;
      padding: 8px 12px;
      border-radius: 50px;
      margin-left: 8px;
      cursor: pointer;
    }

    /* Chat Panel */
    #chat-panel {
      position: fixed;
      right: -420px;
      bottom: 0;
      width: 400px;
      height: 500px;
      background: rgba(10,10,20,0.85);
      backdrop-filter: blur(16px);
      border-radius: 20px 0 0 20px;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      transition: right 0.35s ease;
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
      z-index: 99999;
      font-family: Inter, sans-serif;
    }
    #chat-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px;
      font-size: 16px;
      font-weight: bold;
      color: #fff;
      background: rgba(30,30,50,0.6);
      border-bottom: 1px solid rgba(255,255,255,0.1);
    }
    #chat-messages {
      flex: 1;
      padding: 15px;
      overflow-y: auto;
      color: #fff;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .msg-user {
      align-self: flex-end;
      background: rgba(124, 58, 237,0.2);
      padding: 8px 12px;
      border-radius: 15px;
      max-width: 75%;
      color: #fff;
    }
    .msg-bot {
      align-self: flex-start;
      background: rgba(124, 58, 237,0.6);
      padding: 8px 12px;
      border-radius: 15px;
      max-width: 75%;
      color: #fff;
    }
    #chat-actions {
      display: flex;
      gap: 6px;
      padding: 10px;
      background: rgba(30,30,50,0.6);
    }
    #chat-actions input {
      flex: 1;
      padding: 8px 12px;
      border-radius: 50px;
      border: none;
      outline: none;
      background: rgba(20,20,30,0.5);
      color: #fff;
    }
    #chat-actions button {
      padding: 8px 12px;
      border-radius: 50px;
      border: none;
      background: #7C3AED;
      color: #fff;
      cursor: pointer;
    }
  `;
  document.head.appendChild(style);

  // Helper to add messages
  function addMessage(sender, text) {
    const div = document.createElement("div");
    div.className = sender === "user" ? "msg-user" : "msg-bot";
    div.textContent = text;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  // Send function
  async function sendMessage(msg) {
    addMessage("user", msg);
    try {
      const res = await fetch("https://chatbot-for-mintlify.vercel.app/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg }),
      });
      const data = await res.json();
      addMessage("bot", data.reply || "No response");
    } catch (err) {
      addMessage("bot", "Server error");
    }
  }

  // Floating bar Enter
  inputBar.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && inputBar.value.trim()) {
      sendMessage(inputBar.value.trim());
      chatPanel.style.right = "0px"; // slide out panel
      inputBar.value = "";
    }
  });

  // Panel input Enter
  panelInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && panelInput.value.trim()) {
      sendMessage(panelInput.value.trim());
      panelInput.value = "";
    }
  });

  // Send button click
  chatPanel.querySelector("#chat-send").addEventListener("click", () => {
    if (panelInput.value.trim()) {
      sendMessage(panelInput.value.trim());
      panelInput.value = "";
    }
  });

  // Close button
  chatPanel.querySelector("#chat-close-btn").addEventListener("click", () => {
    chatPanel.style.right = "-420px";
  });

  // Voice / upload placeholders
  chatPanel.querySelector("#chat-voice").addEventListener("click", () => alert("Voice input not implemented yet."));
  chatPanel.querySelector("#chat-upload").addEventListener("click", () => alert("Upload files not implemented yet."));
});
