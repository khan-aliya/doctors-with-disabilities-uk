(function () {
  "use strict";

  var style = document.createElement("style");
  style.textContent = [
    "#dwd-chat-trigger {",
    "  position: fixed; bottom: 28px; right: 28px; z-index: 1000;",
    "  background: #3d1f5c; color: white; border: none; border-radius: 999px;",
    "  padding: 0.75rem 1.25rem 0.75rem 1rem;",
    "  font-family: 'Nunito', sans-serif; font-size: 0.88rem; font-weight: 700;",
    "  cursor: pointer; display: flex; align-items: center; gap: 0.5rem;",
    "  box-shadow: 0 4px 20px rgba(61,31,92,0.35); white-space: nowrap;",
    "  transition: background 0.18s ease, transform 0.18s ease, box-shadow 0.18s ease;",
    "}",
    "#dwd-chat-trigger:hover { background: #5b2d82; transform: translateY(-2px); box-shadow: 0 6px 24px rgba(61,31,92,0.45); }",
    "#dwd-chat-trigger:focus-visible { outline: 2.5px solid #b5821a; outline-offset: 3px; }",
    "#dwd-chat-panel {",
    "  position: fixed; bottom: 90px; right: 28px; z-index: 1000;",
    "  width: 380px; max-width: calc(100vw - 40px); max-height: 560px;",
    "  background: #ffffff; border-radius: 16px;",
    "  border: 1px solid rgba(91,45,130,0.15);",
    "  box-shadow: 0 12px 48px rgba(61,31,92,0.18);",
    "  display: flex; flex-direction: column; overflow: hidden;",
    "  transform: translateY(12px); opacity: 0; pointer-events: none;",
    "  transition: transform 0.22s cubic-bezier(0.34,1.56,0.64,1), opacity 0.18s ease;",
    "}",
    "#dwd-chat-panel.is-open { transform: translateY(0); opacity: 1; pointer-events: all; }",
    ".dwd-chat-header { background: #3d1f5c; padding: 1rem 1.25rem; display: flex; align-items: flex-start; justify-content: space-between; gap: 0.75rem; flex-shrink: 0; }",
    ".dwd-chat-header-text h3 { font-family: 'Lora', Georgia, serif; font-size: 1rem; font-weight: 600; color: white; margin: 0 0 0.2rem; line-height: 1.3; }",
    ".dwd-chat-header-text p { font-size: 0.72rem; color: rgba(255,255,255,0.6); margin: 0; line-height: 1.4; }",
    ".dwd-chat-close { background: none; border: none; color: rgba(255,255,255,0.6); font-size: 1.1rem; cursor: pointer; padding: 0.1rem 0.25rem; line-height: 1; flex-shrink: 0; transition: color 0.15s ease; font-family: sans-serif; }",
    ".dwd-chat-close:hover { color: white; }",
    ".dwd-chat-close:focus-visible { outline: 2px solid #b5821a; outline-offset: 2px; border-radius: 3px; }",
    ".dwd-chat-disclaimer { background: #fbf5e6; border-bottom: 1px solid rgba(181,130,26,0.2); padding: 0.55rem 1.25rem; font-size: 0.7rem; color: #7a5200; line-height: 1.45; flex-shrink: 0; }",
    ".dwd-chat-disclaimer strong { font-weight: 700; }",
    ".dwd-chat-messages { flex: 1; overflow-y: auto; padding: 1rem 1.25rem; display: flex; flex-direction: column; gap: 0.85rem; scroll-behavior: smooth; }",
    ".dwd-chat-messages::-webkit-scrollbar { width: 4px; }",
    ".dwd-chat-messages::-webkit-scrollbar-track { background: transparent; }",
    ".dwd-chat-messages::-webkit-scrollbar-thumb { background: rgba(91,45,130,0.15); border-radius: 4px; }",
    ".dwd-msg { display: flex; flex-direction: column; max-width: 88%; }",
    ".dwd-msg--user { align-self: flex-end; align-items: flex-end; }",
    ".dwd-msg--assistant { align-self: flex-start; align-items: flex-start; }",
    ".dwd-msg__bubble { padding: 0.65rem 0.9rem; border-radius: 12px; font-size: 0.84rem; line-height: 1.58; font-family: 'Nunito', sans-serif; }",
    ".dwd-msg--user .dwd-msg__bubble { background: #3d1f5c; color: white; border-radius: 12px 12px 3px 12px; }",
    ".dwd-msg--assistant .dwd-msg__bubble { background: #f3edf8; color: #2a1a2e; border-radius: 12px 12px 12px 3px; border: 1px solid rgba(91,45,130,0.1); }",
    ".dwd-msg--error .dwd-msg__bubble { background: #fef2f2; color: #c0392b; border: 1px solid #fecaca; border-radius: 12px 12px 12px 3px; }",
    ".dwd-typing { display: flex; align-items: center; gap: 4px; padding: 0.7rem 0.9rem; background: #f3edf8; border-radius: 12px 12px 12px 3px; border: 1px solid rgba(91,45,130,0.1); width: fit-content; }",
    ".dwd-typing span { width: 6px; height: 6px; border-radius: 50%; background: #7b4ba8; animation: dwd-bounce 1.2s infinite; display: block; }",
    ".dwd-typing span:nth-child(2) { animation-delay: 0.2s; }",
    ".dwd-typing span:nth-child(3) { animation-delay: 0.4s; }",
    "@keyframes dwd-bounce { 0%, 80%, 100% { transform: translateY(0); opacity: 0.5; } 40% { transform: translateY(-5px); opacity: 1; } }",
    ".dwd-suggestions { display: flex; flex-direction: column; gap: 0.4rem; margin-top: 0.3rem; }",
    ".dwd-suggestion-btn { background: white; border: 1.5px solid rgba(91,45,130,0.2); border-radius: 8px; padding: 0.45rem 0.75rem; font-size: 0.78rem; font-family: 'Nunito', sans-serif; color: #5b2d82; font-weight: 600; cursor: pointer; text-align: left; transition: background 0.15s ease, border-color 0.15s ease; line-height: 1.4; }",
    ".dwd-suggestion-btn:hover { background: #f3edf8; border-color: rgba(91,45,130,0.4); }",
    ".dwd-suggestion-btn:focus-visible { outline: 2px solid #b5821a; outline-offset: 2px; }",
    ".dwd-chat-input-area { border-top: 1px solid rgba(91,45,130,0.1); padding: 0.85rem 1.25rem; display: flex; gap: 0.6rem; align-items: flex-end; flex-shrink: 0; background: white; }",
    ".dwd-chat-input { flex: 1; font-family: 'Nunito', sans-serif; font-size: 0.84rem; color: #2a1a2e; background: #f8f4fa; border: 1.5px solid rgba(91,45,130,0.18); border-radius: 10px; padding: 0.6rem 0.85rem; resize: none; min-height: 40px; max-height: 100px; outline: none; line-height: 1.5; transition: border-color 0.15s ease; }",
    ".dwd-chat-input:focus { border-color: #9b6ec4; }",
    ".dwd-chat-input::placeholder { color: #8b6a9e; }",
    ".dwd-chat-send { background: #3d1f5c; color: white; border: none; border-radius: 10px; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0; transition: background 0.15s ease; }",
    ".dwd-chat-send:hover { background: #5b2d82; }",
    ".dwd-chat-send:disabled { opacity: 0.45; cursor: not-allowed; }",
    ".dwd-chat-send:focus-visible { outline: 2px solid #b5821a; outline-offset: 2px; }",
    "@media (max-width: 480px) {",
    "  #dwd-chat-panel { right: 12px; bottom: 80px; width: calc(100vw - 24px); max-height: 70vh; }",
    "  #dwd-chat-trigger { right: 12px; bottom: 16px; }",
    "}",
  ].join("\n");
  document.head.appendChild(style);

  var trigger = document.createElement("button");
  trigger.id = "dwd-chat-trigger";
  trigger.setAttribute("aria-label", "Open rights advisor chat");
  trigger.setAttribute("aria-expanded", "false");
  trigger.setAttribute("aria-controls", "dwd-chat-panel");
  trigger.innerHTML =
    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="white" stroke-width="1.8"/><path d="M12 8V12M12 16H12.01" stroke="white" stroke-width="2" stroke-linecap="round"/></svg> Ask about your rights';

  var panel = document.createElement("div");
  panel.id = "dwd-chat-panel";
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-modal", "false");
  panel.setAttribute("aria-label", "Rights advisor");
  panel.innerHTML =
    '<div class="dwd-chat-header"><div class="dwd-chat-header-text"><h3>Rights Advisor</h3><p>Peer guidance — not legal advice</p></div><button class="dwd-chat-close" aria-label="Close chat" id="dwd-chat-close">&#x2715;</button></div><div class="dwd-chat-disclaimer"><strong>Guidance only.</strong> For your individual circumstances, always consult the BMA or a qualified solicitor.</div><div class="dwd-chat-messages" id="dwd-chat-messages" role="log" aria-live="polite" aria-label="Chat messages"></div><div class="dwd-chat-input-area"><textarea class="dwd-chat-input" id="dwd-chat-input" placeholder="Describe your situation..." rows="1" aria-label="Your message" maxlength="2000"></textarea><button class="dwd-chat-send" id="dwd-chat-send" aria-label="Send message"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M22 2L11 13M22 2L15 22L11 13L2 9L22 2Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button></div>';

  document.body.appendChild(trigger);
  document.body.appendChild(panel);

  var SUGGESTIONS = [
    "Does the Equality Act cover my condition?",
    "My employer keeps ignoring my adjustment request",
    "Can I be put on capability for disability-related sick leave?",
    "I don't know if I should disclose my condition",
    "What should I do if my trust refuses my request?",
  ];

  var isOpen = false;
  var isLoading = false;
  var hasStarted = false;

  var messagesEl = document.getElementById("dwd-chat-messages");
  var inputEl = document.getElementById("dwd-chat-input");
  var sendBtn = document.getElementById("dwd-chat-send");
  var closeBtn = document.getElementById("dwd-chat-close");

  function addMessage(text, role) {
    var msg = document.createElement("div");
    msg.className = "dwd-msg dwd-msg--" + role;
    var bubble = document.createElement("div");
    bubble.className = "dwd-msg__bubble";
    bubble.innerHTML = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, function (match, label, url) {
        var href = url.startsWith("http") ? url : "/" + url;
        var target = url.startsWith("http")
          ? ' target="_blank" rel="noopener noreferrer"'
          : "";
        return (
          '<a href="' +
          href +
          '"' +
          target +
          ' style="color:#5b2d82;font-weight:600;">' +
          label +
          "</a>"
        );
      })
      .replace(/\n\n/g, "<br><br>")
      .replace(/\n/g, "<br>");
    msg.appendChild(bubble);
    messagesEl.appendChild(msg);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return msg;
  }

  function addTypingIndicator() {
    var msg = document.createElement("div");
    msg.className = "dwd-msg dwd-msg--assistant";
    msg.id = "dwd-typing";
    msg.innerHTML =
      '<div class="dwd-typing" aria-label="Advisor is thinking"><span></span><span></span><span></span></div>';
    messagesEl.appendChild(msg);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function removeTypingIndicator() {
    var t = document.getElementById("dwd-typing");
    if (t) t.remove();
  }

  function showWelcome() {
    if (hasStarted) return;
    hasStarted = true;
    addMessage(
      "Hello — I am here to help you understand your rights as a disabled doctor in the UK.\n\nDescribe your situation or pick a question below and I will point you to what is relevant.",
      "assistant",
    );
    var suggestionsEl = document.createElement("div");
    suggestionsEl.className = "dwd-msg dwd-msg--assistant";
    var inner = document.createElement("div");
    inner.className = "dwd-suggestions";
    SUGGESTIONS.forEach(function (q) {
      var btn = document.createElement("button");
      btn.className = "dwd-suggestion-btn";
      btn.textContent = q;
      btn.addEventListener("click", function () {
        if (suggestionsEl.parentNode)
          suggestionsEl.parentNode.removeChild(suggestionsEl);
        sendMessage(q);
      });
      inner.appendChild(btn);
    });
    suggestionsEl.appendChild(inner);
    messagesEl.appendChild(suggestionsEl);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function sendMessage(text) {
    var trimmed = (text || inputEl.value).trim();
    if (!trimmed || isLoading) return;
    inputEl.value = "";
    inputEl.style.height = "auto";
    isLoading = true;
    sendBtn.disabled = true;
    addMessage(trimmed, "user");
    addTypingIndicator();
    fetch("/.netlify/functions/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: trimmed }),
    })
      .then(function (res) {
        removeTypingIndicator();
        if (!res.ok) {
          return res
            .json()
            .catch(function () {
              return {};
            })
            .then(function (err) {
              addMessage(
                err.error ||
                  "Sorry, something went wrong. Please try again in a moment.",
                "error",
              );
            });
        }
        return res.json().then(function (data) {
          addMessage(data.reply, "assistant");
        });
      })
      .catch(function () {
        removeTypingIndicator();
        addMessage(
          "I could not connect right now. Please check your connection and try again.",
          "error",
        );
      })
      .finally(function () {
        isLoading = false;
        sendBtn.disabled = false;
        inputEl.focus();
      });
  }

  function openPanel() {
    isOpen = true;
    panel.classList.add("is-open");
    trigger.setAttribute("aria-expanded", "true");
    showWelcome();
    setTimeout(function () {
      inputEl.focus();
    }, 250);
  }

  function closePanel() {
    isOpen = false;
    panel.classList.remove("is-open");
    trigger.setAttribute("aria-expanded", "false");
    trigger.focus();
  }

  trigger.addEventListener("click", function () {
    isOpen ? closePanel() : openPanel();
  });
  closeBtn.addEventListener("click", closePanel);

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && isOpen) closePanel();
  });

  inputEl.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  sendBtn.addEventListener("click", function () {
    sendMessage();
  });

  inputEl.addEventListener("input", function () {
    inputEl.style.height = "auto";
    inputEl.style.height = Math.min(inputEl.scrollHeight, 100) + "px";
  });

  // Keep chat trigger above cookie banner when banner is visible
  function adjustTriggerForBanner() {
    var banner = document.getElementById("cookieBanner");
    if (!banner) return;
    function update() {
      if (banner.classList.contains("hidden")) {
        trigger.style.bottom = "28px";
      } else {
        trigger.style.bottom = banner.offsetHeight + 12 + "px";
      }
    }
    update();
    var observer = new MutationObserver(update);
    observer.observe(banner, { attributes: true, attributeFilter: ["class"] });
  }
  adjustTriggerForBanner();
})();
