/**
 * routes/chat.js — Xử lý AI Chatbot
 *   POST /api/chat
 */
const express = require('express');
const router = express.Router();

// Nếu dự án của bạn có dùng Google Generative AI (Gemini SDK) hoặc xử lý AI, hãy cấu hình ở đây.
// Ví dụ mẫu cơ bản để tránh lỗi 404:
router.post('/', async (req, res) => {
  try {
    const { message, history } = req.body || {};
    if (!message) {
      return res.status(400).json({ error: 'Vui lòng nhập nội dung tin nhắn.' });
    }

    // TODO: Viết logic gọi API của Google Gemini tại đây nếu cần thiết
    // Tạm thời trả về câu trả lời mẫu để kiểm tra kết nối thông suốt:
    const reply = `Chào bạn, tôi đã nhận được câu hỏi: "${message}". Hệ thống AI đang được cấu hình hoàn thiện.`;

    return res.json({ reply });
  } catch (err) {
    console.error('POST /api/chat:', err);
    return res.status(500).json({ error: 'Lỗi server xử lý chatbot.' });
  }
});

module.exports = router;