/**
 * server.js — Backend Node.js/Express cho website VNVD (full-stack)
 *
 *  Phục vụ:
 *   - Toàn bộ website tĩnh trong thư mục /public
 *   - REST API kết nối MySQL:
 *       /api/auth      (đăng ký / đăng nhập / me)
 *       /api/products  (dịch vụ & gói bảng giá)
 *       /api/cart      (giỏ hàng — cần đăng nhập)
 *       /api/orders    (đơn hàng / checkout)
 *       /api/admin     (quản trị — cần role admin)
 *   - /api/chat        (proxy chatbot AI Google Gemini — giữ nguyên như bản cũ)
 */
// Khai báo ở trên cùng
const menuRoutes = require('./api/menus');

// Thêm vào phần /* ============ REST API (MySQL) ============ */
app.use('/api/menus', menuRoutes);

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const { checkConnection } = require('./db/db');
const { attachUser } = require('./api/auth-mw');

const authRoutes = require('./api/auth');
const productRoutes = require('./api/products');
const cartRoutes = require('./api/cart');
const orderRoutes = require('./api/orders');
const adminRoutes = require('./api/admin');

const app = express();
const PORT = process.env.PORT || 3000;

/* ============ Chatbot Gemini (giữ nguyên logic bản cũ) ============ */
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-flash-latest';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;
const MAX_HISTORY_MESSAGES = 20;
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX = 20;
const rateLimitMap = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip) || { count: 0, windowStart: now };
  if (now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    entry.count = 0;
    entry.windowStart = now;
  }
  entry.count += 1;
  rateLimitMap.set(ip, entry);
  return entry.count > RATE_LIMIT_MAX;
}

const SYSTEM_PROMPT = `Bạn là "VNVD AI" — trợ lý ảo thông minh trên website của VNVD, một công ty cung cấp giải pháp chuyển đổi số (Cloud Computing, Bảo mật & An toàn số, AI & Tự động hóa, hạ tầng mạng 5G/SD-WAN...).

Vai trò của bạn:
- Trả lời thân thiện, chuyên nghiệp, ngắn gọn, dễ hiểu bằng tiếng Việt (trừ khi người dùng chủ động dùng ngôn ngữ khác thì trả lời bằng ngôn ngữ đó).
- Ưu tiên tư vấn về các dịch vụ của VNVD khi phù hợp với câu hỏi, nhưng bạn KHÔNG bị giới hạn chỉ trong chủ đề công ty — bạn có thể trò chuyện và trả lời mọi câu hỏi khác của người dùng (kiến thức chung, công nghệ, đời sống, học tập...) một cách hữu ích và chính xác, giống như một trợ lý AI thông thường.
- Khi người dùng hỏi về báo giá cụ thể hoặc muốn được liên hệ trực tiếp, hãy gợi ý họ để lại thông tin ở form "Đăng ký tư vấn miễn phí" hoặc gọi hotline 1800 1260.
- Không bịa đặt thông tin nội bộ (giá cả chính xác, hợp đồng, số liệu riêng tư của công ty) nếu không chắc chắn — trong trường hợp đó, hãy đề nghị kết nối với đội ngũ tư vấn của VNVD.
- Trả lời với độ dài vừa phải, dùng đoạn văn ngắn hoặc gạch đầu dòng khi cần thiết, tránh dài dòng không cần thiết.`;

/* ============ Middleware chung ============ */
app.use(cors({
  origin: 'https://vnpt-web.infinityfree.io',
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
}));
app.use(express.json({ limit: '1mb' }));
app.use(attachUser); // gắn req.user từ JWT (nếu có)

/* ============ REST API (MySQL) ============ */
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

// Healthcheck
app.get('/api/health', (_req, res) => res.json({ ok: true, ts: Date.now() }));

/* ============ Chatbot AI proxy ============ */
app.post('/api/chat', async (req, res) => {
  try {
    if (!GEMINI_API_KEY) {
      return res.status(500).json({
        error: 'Server chưa được cấu hình GEMINI_API_KEY. Vui lòng thêm API key vào file .env.',
      });
    }
    const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown';
    if (isRateLimited(ip)) {
      return res.status(429).json({ error: 'Bạn đang gửi quá nhiều tin nhắn. Vui lòng thử lại sau ít phút.' });
    }
    const { message, history } = req.body || {};
    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'Thiếu nội dung tin nhắn (message).' });
    }
    const safeHistory = Array.isArray(history) ? history.slice(-MAX_HISTORY_MESSAGES) : [];
    const contents = safeHistory.map((m) => ({
      role: m.role === 'bot' ? 'model' : 'user',
      parts: [{ text: String(m.text || '').slice(0, 4000) }],
    }));
    contents.push({ role: 'user', parts: [{ text: message.trim().slice(0, 4000) }] });

    const geminiRes = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        systemInstruction: { role: 'system', parts: [{ text: SYSTEM_PROMPT }] },
        generationConfig: { temperature: 0.8, maxOutputTokens: 800 },
        safetySettings: [
          { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_ONLY_HIGH' },
          { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_ONLY_HIGH' },
          { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_ONLY_HIGH' },
          { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_ONLY_HIGH' },
        ],
      }),
    });
    const data = await geminiRes.json();
    if (!geminiRes.ok) {
      console.error('Gemini API error:', JSON.stringify(data));
      return res.status(502).json({ error: data?.error?.message || 'Không thể kết nối tới Gemini API. Vui lòng thử lại sau.' });
    }
    const candidate = data?.candidates?.[0];
    const finishReason = candidate?.finishReason;
    const text = candidate?.content?.parts?.map((p) => p.text || '').join('').trim();
    if (!text) {
      if (finishReason === 'SAFETY') {
        return res.json({ reply: 'Xin lỗi, mình không thể trả lời nội dung này. Bạn có thể đặt câu hỏi khác được không?' });
      }
      return res.json({ reply: 'Xin lỗi, hiện mình chưa thể trả lời câu hỏi này. Bạn vui lòng thử lại hoặc liên hệ hotline 1800 1260 nhé!' });
    }
    return res.json({ reply: text });
  } catch (err) {
    console.error('Lỗi /api/chat:', err);
    return res.status(500).json({ error: 'Đã xảy ra lỗi phía server. Vui lòng thử lại sau.' });
  }
});

/* ============ Static + SPA fallback ============ */
/* ============ Static + SPA fallback ============ */
// Định vị chính xác thư mục frontend nằm cùng cấp với backend
// const frontendPath = path.resolve(__dirname, '..', 'frontend');

// app.use(express.static(frontendPath));

// app.get('*', (req, res, next) => {
//   if (req.path.startsWith('/api/')) return next();
//   res.sendFile(path.join(frontendPath, 'index.php'), (err) => {
//     if (err) {
//       console.error("❌ Không tìm thấy file index.php tại:", path.join(frontendPath, 'index.php'));
//       res.status(404).send("Cannot GET / (File index.php missing)");
//     }
//   });
// });

app.listen(PORT, async () => {
  // Tự động nhận diện URL public khi chạy trên Render, nếu không có sẽ dùng localhost làm mặc định
  const serverUrl = process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`;

  console.log(`\n===========================================================`);
  console.log(`✅ VNVD server đang chạy thành công tại:`);
  console.log(`   👉 ${serverUrl}`);
  console.log(`===========================================================\n`);

  await checkConnection();
  if (!GEMINI_API_KEY) {
    console.warn('⚠️  Chưa có GEMINI_API_KEY trong .env — chatbot sẽ báo lỗi cho tới khi bạn cấu hình (các API khác vẫn chạy).');
  }
});