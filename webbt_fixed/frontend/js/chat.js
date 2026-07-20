document.addEventListener('DOMContentLoaded', () => {

  const toggleBtn   = document.getElementById('chatbotToggle');
  const closeBtn     = document.getElementById('chatClose');
  const windowEl     = document.getElementById('chatbotWindow');
  const messagesEl   = document.getElementById('chatMessages');
  const inputEl      = document.getElementById('chatInput');
  const sendBtn      = document.getElementById('chatSend');
  const typingEl     = document.getElementById('chatTyping');
  const badgeEl      = toggleBtn?.querySelector('.chat-badge');
  const openIcon     = toggleBtn?.querySelector('.open-icon');
  const closeIcon    = toggleBtn?.querySelector('.close-icon');
  const quickReplies = document.getElementById('quickReplies');

  if (!toggleBtn || !windowEl) return;

  let isOpen = false;
  let isSending = false;

  // Lịch sử hội thoại gửi kèm mỗi request để AI hiểu ngữ cảnh (giữ tối đa 20 tin gần nhất)
  const history = [];
  const MAX_HISTORY = 20;

  // Dùng relative URL để hoạt động trên mọi host/port
  const API_ENDPOINT = 'https://testweb-3dku.onrender.com/api/chat';

  function nowLabel() {
    return new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  }

  function scrollToBottom() {
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  /* Chuyển markdown đơn giản (từ Gemini) sang HTML an toàn: **bold**, *italic*, xuống dòng, gạch đầu dòng */
  function renderMarkdownLite(rawText) {
    const escapeHtml = (s) => s
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    let text = escapeHtml(rawText);

    text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/(?:^|\n)[\-\*]\s+(.+)/g, '\n• $1');

    const paragraphs = text.split(/\n{2,}/).map(p => p.trim()).filter(Boolean);
    if (paragraphs.length === 0) return `<p>${text.replace(/\n/g, '<br>')}</p>`;

    return paragraphs.map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('');
  }

  function addUserMessage(text) {
    const msg = document.createElement('div');
    msg.className = 'msg user-msg';
    msg.innerHTML = `
      <div class="msg-bubble"><p></p></div>
      <span class="msg-time">${nowLabel()}</span>
    `;
    msg.querySelector('p').textContent = text;
    messagesEl.appendChild(msg);
    scrollToBottom();
  }

  function addBotMessage(text) {
    const msg = document.createElement('div');
    msg.className = 'msg bot-msg';
    msg.innerHTML = `
      <div class="msg-avatar">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <circle cx="14" cy="14" r="14" fill="url(#msgGrad)"/>
          <path d="M7 14 L14 7 L21 14 L14 21 Z" fill="white" opacity="0.9"/>
          <circle cx="14" cy="14" r="4" fill="white"/>
        </svg>
      </div>
      <div class="msg-bubble"></div>
      <span class="msg-time">${nowLabel()}</span>
    `;
    msg.querySelector('.msg-bubble').innerHTML = renderMarkdownLite(text);
    messagesEl.appendChild(msg);
    scrollToBottom();
  }

  function addErrorMessage(text) {
    const msg = document.createElement('div');
    msg.className = 'msg bot-msg';
    msg.innerHTML = `
      <div class="msg-avatar">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <circle cx="14" cy="14" r="14" fill="#e63946"/>
          <path d="M14 8v6M14 18h.01" stroke="white" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </div>
      <div class="msg-bubble"><p></p></div>
      <span class="msg-time">${nowLabel()}</span>
    `;
    msg.querySelector('p').textContent = text;
    messagesEl.appendChild(msg);
    scrollToBottom();
  }

  function showTyping() {
    if (typingEl) typingEl.style.display = 'flex';
    scrollToBottom();
  }
  function hideTyping() {
    if (typingEl) typingEl.style.display = 'none';
  }

  function setSendingState(sending) {
    isSending = sending;
    if (sendBtn) sendBtn.disabled = sending;
    if (inputEl) inputEl.disabled = sending;
  }

  async function fetchAIReply(userText) {
    const res = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userText, history }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data?.error || `Lỗi máy chủ (${res.status})`);
    }
    if (!data?.reply) {
      throw new Error('Không nhận được phản hồi hợp lệ từ AI.');
    }
    return data.reply;
  }

  async function sendMessage(text) {
    const trimmed = (text || '').trim();
    if (!trimmed || isSending) return;

    addUserMessage(trimmed);
    inputEl.value = '';
    quickReplies?.remove();

    history.push({ role: 'user', text: trimmed });
    if (history.length > MAX_HISTORY) history.splice(0, history.length - MAX_HISTORY);

    setSendingState(true);
    showTyping();

    try {
      const reply = await fetchAIReply(trimmed);
      hideTyping();
      addBotMessage(reply);
      history.push({ role: 'bot', text: reply });
      if (history.length > MAX_HISTORY) history.splice(0, history.length - MAX_HISTORY);
    } catch (err) {
      hideTyping();
      console.error('Chat AI error:', err);
      addErrorMessage('Xin lỗi, hiện không thể kết nối tới trợ lý AI. Vui lòng thử lại sau hoặc gọi hotline 1800 1260.');
    } finally {
      setSendingState(false);
      inputEl?.focus();
    }
  }

  /* ---- Toggle open/close ---- */
  function openChat() {
    isOpen = true;
    windowEl.classList.add('open');
    if (openIcon) openIcon.style.display = 'none';
    if (closeIcon) closeIcon.style.display = 'flex';
    if (badgeEl) badgeEl.style.display = 'none';
    inputEl?.focus();
  }
  function closeChat() {
    isOpen = false;
    windowEl.classList.remove('open');
    if (openIcon) openIcon.style.display = 'flex';
    if (closeIcon) closeIcon.style.display = 'none';
  }

  toggleBtn.addEventListener('click', () => (isOpen ? closeChat() : openChat()));
  closeBtn?.addEventListener('click', closeChat);

  /* ---- Send message actions ---- */
  sendBtn?.addEventListener('click', () => sendMessage(inputEl.value));
  inputEl?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !isSending) sendMessage(inputEl.value);
  });

  /* ---- Quick reply buttons ---- */
  document.querySelectorAll('.qr-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const msg = btn.getAttribute('data-msg') || btn.textContent;
      sendMessage(msg);
    });
  });

});
