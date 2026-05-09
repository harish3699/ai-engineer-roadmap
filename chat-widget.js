(function () {
  // Inject styles
  var style = document.createElement('style');
  style.textContent = [
    '#ae-chat-btn{position:fixed;bottom:28px;right:28px;z-index:9999;width:56px;height:56px;border-radius:50%;border:none;cursor:pointer;background:linear-gradient(135deg,#2352d8,#6d28d9);box-shadow:0 4px 20px rgba(35,82,216,.45);display:flex;align-items:center;justify-content:center;transition:transform .2s,box-shadow .2s}',
    '#ae-chat-btn:hover{transform:scale(1.08);box-shadow:0 6px 28px rgba(35,82,216,.6)}',
    '#ae-chat-btn svg{width:26px;height:26px;fill:#fff}',
    '#ae-chat-bubble{display:none;position:fixed;bottom:96px;right:28px;z-index:9998;width:380px;height:540px;border-radius:16px;overflow:hidden;box-shadow:0 12px 48px rgba(0,0,0,.35);border:1px solid rgba(255,255,255,.08);flex-direction:column;background:var(--bg-card,#10152e)}',
    '#ae-chat-bubble.open{display:flex}',
    '.ae-chat-header{padding:14px 18px;background:linear-gradient(135deg,#2352d8,#6d28d9);color:#fff;font-family:"Inter Tight",sans-serif;font-size:14px;font-weight:600;display:flex;align-items:center;gap:10px;flex-shrink:0}',
    '.ae-chat-header-dot{width:8px;height:8px;border-radius:50%;background:#4ade80;flex-shrink:0}',
    '.ae-chat-header-close{margin-left:auto;background:none;border:none;color:rgba(255,255,255,.7);cursor:pointer;font-size:18px;line-height:1;padding:0}',
    '.ae-chat-messages{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:12px;font-family:"Inter Tight",sans-serif;font-size:13.5px;scrollbar-width:thin;scrollbar-color:rgba(255,255,255,.1) transparent}',
    '.ae-msg{max-width:85%;line-height:1.55;padding:10px 14px;border-radius:12px;word-break:break-word}',
    '.ae-msg.user{align-self:flex-end;background:#2352d8;color:#fff;border-bottom-right-radius:4px}',
    '.ae-msg.bot{align-self:flex-start;background:var(--bg-elev,#1a2040);color:var(--fg,#e8eaf6);border-bottom-left-radius:4px}',
    '.ae-msg.typing{opacity:.6;font-style:italic}',
    '.ae-chat-input-row{padding:12px 14px;border-top:1px solid rgba(255,255,255,.06);display:flex;gap:8px;flex-shrink:0;background:var(--bg-card,#10152e)}',
    '.ae-chat-input{flex:1;background:var(--bg-elev,#1a2040);border:1px solid rgba(255,255,255,.1);border-radius:8px;padding:9px 12px;color:var(--fg,#e8eaf6);font-family:"Inter Tight",sans-serif;font-size:13px;outline:none;resize:none}',
    '.ae-chat-input::placeholder{color:rgba(255,255,255,.3)}',
    '.ae-chat-send{background:#2352d8;border:none;border-radius:8px;padding:9px 14px;color:#fff;cursor:pointer;font-size:14px;flex-shrink:0;transition:background .15s}',
    '.ae-chat-send:hover{background:#3b6af5}',
    '.ae-chat-send:disabled{opacity:.4;cursor:not-allowed}',
    '.ae-notice{font-size:11px;color:rgba(255,255,255,.3);text-align:center;padding:4px 0 0;font-family:"Inter Tight",sans-serif}'
  ].join('');
  document.head.appendChild(style);

  // Inject HTML
  var btn = document.createElement('button');
  btn.id = 'ae-chat-btn';
  btn.title = 'Ask the Roadmap Guide';
  btn.setAttribute('aria-label', 'Open AI chat');
  btn.innerHTML = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M20 2H4a2 2 0 0 0-2 2v18l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zm-2 10H6V10h12v2zm0-3H6V7h12v2z"/></svg>';

  var bubble = document.createElement('div');
  bubble.id = 'ae-chat-bubble';
  bubble.setAttribute('role', 'dialog');
  bubble.setAttribute('aria-label', 'Roadmap Guide Chat');
  bubble.innerHTML =
    '<div class="ae-chat-header">' +
      '<div class="ae-chat-header-dot"></div>' +
      'Roadmap Guide · Ask anything' +
      '<button class="ae-chat-header-close" id="ae-chat-close" aria-label="Close chat">✕</button>' +
    '</div>' +
    '<div class="ae-chat-messages" id="ae-chat-messages">' +
      '<div class="ae-msg bot">Hi! I\'m the Roadmap Guide. Ask me which phase to start from, what any module covers, or how long the roadmap takes. 👋</div>' +
    '</div>' +
    '<div class="ae-chat-input-row">' +
      '<textarea class="ae-chat-input" id="ae-chat-input" rows="1" placeholder="Ask about the roadmap…"></textarea>' +
      '<button class="ae-chat-send" id="ae-chat-send">↑</button>' +
    '</div>' +
    '<div class="ae-notice">Powered by Groq · Llama 3.3 70B</div>';

  document.body.appendChild(btn);
  document.body.appendChild(bubble);

  // Logic
  var WEBHOOK = 'https://pang-startling-skimmer.ngrok-free.dev/webhook/roadmap-chat';
  var SESSION = 'ae-' + Math.random().toString(36).slice(2);
  var msgs  = document.getElementById('ae-chat-messages');
  var input = document.getElementById('ae-chat-input');
  var send  = document.getElementById('ae-chat-send');

  btn.addEventListener('click', function () {
    bubble.classList.toggle('open');
    if (bubble.classList.contains('open')) input.focus();
  });
  document.getElementById('ae-chat-close').addEventListener('click', function () {
    bubble.classList.remove('open');
  });

  function addMsg(text, role) {
    var d = document.createElement('div');
    d.className = 'ae-msg ' + role;
    d.textContent = text;
    msgs.appendChild(d);
    msgs.scrollTop = msgs.scrollHeight;
    return d;
  }

  async function sendMessage() {
    var text = input.value.trim();
    if (!text) return;
    input.value = '';
    input.style.height = 'auto';
    send.disabled = true;
    addMsg(text, 'user');
    var typing = addMsg('Thinking…', 'bot typing');
    try {
      var res = await fetch(WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatInput: text, sessionId: SESSION })
      });
      var data = await res.json();
      typing.remove();
      addMsg(data.output || data.text || data.message || JSON.stringify(data), 'bot');
    } catch (e) {
      typing.remove();
      addMsg('Sorry, the guide is offline right now. Try again in a moment.', 'bot');
    }
    send.disabled = false;
    input.focus();
  }

  send.addEventListener('click', sendMessage);
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  });
  input.addEventListener('input', function () {
    this.style.height = 'auto';
    this.style.height = Math.min(this.scrollHeight, 100) + 'px';
  });
})();
