(function () {
  const API = "https://flamey-chat-backend.vercel.app/api/chat"; // your backend

  function createWidget() {
    const box = document.createElement("div");
    Object.assign(box.style, {
      position: "fixed",
      right: "20px",
      bottom: "20px",
      width: "350px",
      height: "450px",
      background: "#0A0A0F",
      border: "1px solid #333",
      borderRadius: "12px",
      overflow: "hidden",
      zIndex: 9999,
      color: "#fff",
      fontFamily: "Inter, sans-serif"
    });

    box.innerHTML = `
      <div style="background:#7C3AED;padding:10px;font-weight:bold;">Flamey Chatbot</div>
      <div id="log" style="height:330px;overflow:auto;padding:10px;"></div>
      <div style="padding:10px;display:flex;gap:10px;">
        <input id="msg" placeholder="Ask..." style="flex:1;padding:8px;border-radius:8px;border:none;background:#151521;color:#fff;" />
        <button id="send" style="padding:8px 12px;border-radius:8px;border:none;background:#8660FA;color:#fff;">Send</button>
      </div>
    `;

    document.body.appendChild(box);

    const log = box.querySelector("#log");
    const msg = box.querySelector("#msg");
    const send = box.querySelector("#send");

    send.onclick = async () => {
      const text = msg.value;
      if (!text) return;

      log.innerHTML += `<div><b>You:</b> ${text}</div>`;
      msg.value = "";

      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text })
      });

      const data = await res.json();
      log.innerHTML += `<div><b>Bot:</b> ${data.reply}</div>`;
      log.scrollTop = log.scrollHeight;
    };
  }

  window.addEventListener("DOMContentLoaded", createWidget);
})();
