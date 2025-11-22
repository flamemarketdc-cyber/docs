document.addEventListener("DOMContentLoaded", () => {
  // Elements
  const floatingBox = document.getElementById("floating-chat-input");
  const floatingInput = document.getElementById("ask-input");
  const panel = document.getElementById("chat-panel");
  const messages = document.getElementById("chat-messages");
  const chatInput = document.getElementById("chatbox-input");

  if (!floatingBox || !floatingInput || !panel || !messages || !chatInput) {
    console.error("Chatbot elements not found on this page.");
    return;
  }

  // Floating input: Enter
  floatingInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && floatingInput.value.trim()) {
      const q = floatingInput.value.trim();
      floatingBox.style.display = "none"; // hide floating bar
      panel.style.right = "0px"; // slide in panel
      addMessage("user", q);
      sendToBot(q);
      floatingInput.value = "";
    }
  });

  // Panel input: Enter
  chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && chatInput.value.trim()) {
      const msg = chatInput.value.trim();
      addMessage("user", msg);
      sendToBot(msg);
      chatInput.value = "";
    }
  });

  // Add message to panel
  function addMessage(sender, text) {
    const div = document.createElement("div");
    div.innerHTML =
      sender === "user"
        ? `<div class="msg-user">You:</div>${text}`
        : `<div class="msg-bot">Bot:</div>${text}`;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  // Send message to backend
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
      addMessage("bot", data.reply || "No response received.");
    } catch (err) {
      messages.lastChild.remove();
      addMessage("bot", "Error: Unable to reach server.");
    }
  }

  // Inject styles
  const style = document.createElement("style");
  style.innerHTML = `
    #floating-chat-input {
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      width: 350px;
      background: #111;
      padding: 10px 15px;
      border-radius: 999px;
      display: flex;
      justify-content: center;
      box-shadow: 0 4px 15px rgba(0,0,0,0.4);
      z-index: 9999;
    }
    #floating-chat-input input {
      width: 100%;
      background: #000;
      border: none;
      padding: 10px;
      border-radius: 999px;
      outline: none;
      color: #fff;
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
    }
    #chat-header {
      padding: 20px;
      font-size: 20px;
      font-weight: bold;
      background: #111;
      border-bottom: 1px solid #222;
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
      background: #000;
      color: #fff;
      border-top: 1px solid #222;
    }
    .msg-user { color: #a78bfa; font-weight: 600; margin-top: 10px; }
    .msg-bot  { color: #7c3aed; font-weight: 600; margin-top: 10px; }
  `;
  document.head.appendChild(style);
});
