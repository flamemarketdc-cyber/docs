document.addEventListener("DOMContentLoaded", () => {
  // Create floating input bar
  const floatingBox = document.createElement("div");
  floatingBox.id = "floating-chat-input";
  const floatingInput = document.createElement("input");
  floatingInput.id = "ask-input";
  floatingInput.placeholder = "Ask a question...";
  floatingBox.appendChild(floatingInput);
  document.body.appendChild(floatingBox);

  // Create right-side chat panel
  const panel = document.createElement("div");
  panel.id = "chat-panel";
  panel.innerHTML = `
    <div id="chat-header">Flamey Chatbot</div>
    <div id="chat-messages"></div>
    <input id="chatbox-input" type="text" placeholder="Type your message..." />
  `;
  document.body.appendChild(panel);

  const messages = panel.querySelector("#chat-messages");
  const chatInput = panel.querySelector("#chatbox-input");

  // Styles
  const style = document.createElement("style");
  style.innerHTML = `
    #floating-chat-input {
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      width: 300px;
      background: #1a1a1a;
      padding: 10px 15px;
      border-radius: 999px;
      display: flex;
      justify-content: center;
      box-shadow: 0 4px 15px rgba(0,0,0,0.5);
      z-index: 9999;
    }
    #floating-chat-input input {
      width: 100%;
      background: #111;
      border: none;
      padding: 10px;
      border-radius: 999px;
      outline: none;
      color: #fff;
      font-size: 14px;
    }
    #chat-panel {
      position: fixed;
      right: -400px;
      top: 0;
      width: 400px;
      height: 100vh;
      background: #0a0a0a;
      border-left: 1px solid #222;
      display: flex;
      flex-direction: column;
      transition: right 0.35s ease;
      z-index: 99999;
      font-family: Inter, sans-serif;
    }
    #chat-header {
      padding: 20px;
      font-size: 18px;
      font-weight: bold;
      background: #111;
      border-bottom: 1px solid #222;
      color: #fff;
    }
    #chat-messages {
      flex: 1;
      padding: 15px;
      overflow-y: auto;
      color: #fff;
    }
    #chatbox-input {
      padding: 15px;
      border: none;
      outline: none;
      background: #111;
      color: #fff;
      border-top: 1px solid #222;
    }
    .msg-user { color: #a78bfa; font-weight: 600; margin-top: 10px; }
    .msg-bot  { color: #7c3aed; font-weight: 600; margin-top: 10px; }
  `;
  document.head.appendChild(style);

  // Helpers
  function addMessage(sender, text) {
    const div = document.createElement("div");
    div.innerHTML =
      sender === "user"
        ? `<div class="msg-user">You:</div>${text}`
        : `<div class="msg-bot">Bot:</div>${text}`;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  async function sendToBot(message) {
    addMessage("bot", "Typing...");
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const data = await res.json();
      messages.lastChild.remove(); // remove "Typing..."
      addMessage("bot", data.reply || "No response.");
    } catch (err) {
      messages.lastChild.remove();
      addMessage("bot", "Error: Cannot reach server.");
    }
  }

  // Floating input Enter
  floatingInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && floatingInput.value.trim()) {
      const q = floatingInput.value.trim();
      floatingBox.style.display = "none";
      panel.style.right = "0px";
      addMessage("user", q);
      sendToBot(q);
      floatingInput.value = "";
    }
  });

  // Panel input Enter
  chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && chatInput.value.trim()) {
      const msg = chatInput.value.trim();
      addMessage("user", msg);
      sendToBot(msg);
      chatInput.value = "";
    }
  });
});
