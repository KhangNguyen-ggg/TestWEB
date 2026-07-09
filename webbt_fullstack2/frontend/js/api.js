/**
 * public/api.js — Lớp gọi API backend cho frontend VNVD.
 *
 * Cung cấp window.VNVDApi với các phương thức auth / products / cart / orders / admin.
 * - Tự động gắn JWT (Bearer) lấy từ localStorage 'vnvd_token'.
 * - Tự dò backend qua /api/health: nếu KHÔNG có backend (vd xem bản tĩnh),
 *   VNVDApi.available = false để các module tự chuyển sang chế độ localStorage (offline).
 */
(function () {
  'use strict';

  const TOKEN_KEY = 'vnvd_token';
  // Base URL: cùng origin khi chạy qua server; để trống -> đường dẫn tương đối.
const BASE = 'http://localhost:3000';

  function getToken() { return localStorage.getItem(TOKEN_KEY) || ''; }
  function setToken(t) {
    if (t) localStorage.setItem(TOKEN_KEY, t);
    else localStorage.removeItem(TOKEN_KEY);
  }

  async function request(method, url, body) {
    const headers = { 'Content-Type': 'application/json' };
    const token = getToken();
    if (token) headers['Authorization'] = 'Bearer ' + token;

    const res = await fetch(BASE + url, {
      method,
      headers,
      body: body != null ? JSON.stringify(body) : undefined,
    });

    let data = null;
    try { data = await res.json(); } catch (_e) { data = null; }

    if (!res.ok) {
      const err = new Error((data && data.error) || ('Lỗi ' + res.status));
      err.status = res.status;
      err.data = data;
      throw err;
    }
    return data;
  }

  const VNVDApi = {
    available: null, // null = chưa dò; true/false sau khi gọi detect()
    getToken,
    setToken,

    // Dò xem backend có sống không (dùng để bật/tắt chế độ offline).
    async detect() {
      try {
        const ctrl = new AbortController();
        const t = setTimeout(() => ctrl.abort(), 2500);
        const res = await fetch(BASE + '/api/health', { signal: ctrl.signal });
        clearTimeout(t);
        this.available = res.ok;
      } catch (_e) {
        this.available = false;
      }
      return this.available;
    },

    /* ---- Auth ---- */
    register(payload) { return request('POST', '/api/auth/register', payload); },
    login(email, password) { return request('POST', '/api/auth/login', { email, password }); },
    me() { return request('GET', '/api/auth/me'); },

    /* ---- Products ---- */
    products(query) {
      const qs = query ? ('?' + new URLSearchParams(query).toString()) : '';
      return request('GET', '/api/products' + qs);
    },
    product(code) { return request('GET', '/api/products/' + encodeURIComponent(code)); },

    /* ---- Cart ---- */
    getCart() { return request('GET', '/api/cart'); },
    addToCart(code, qty) { return request('POST', '/api/cart', { code, qty: qty || 1 }); },
    setCartQty(code, qty) { return request('PUT', '/api/cart/' + encodeURIComponent(code), { qty }); },
    removeFromCart(code) { return request('DELETE', '/api/cart/' + encodeURIComponent(code)); },
    clearCart() { return request('DELETE', '/api/cart'); },

    /* ---- Orders ---- */
    checkout(note) { return request('POST', '/api/orders', { note: note || null }); },
    myOrders() { return request('GET', '/api/orders'); },

    /* ---- Admin ---- */
    adminStats() { return request('GET', '/api/admin/stats'); },
    adminUsers() { return request('GET', '/api/admin/users'); },
    adminProducts() { return request('GET', '/api/admin/products'); },
    adminOrders() { return request('GET', '/api/admin/orders'); },
  };

  window.VNVDApi = VNVDApi;
  // Dò backend ngay khi tải trang (các module chờ qua VNVDApi.available).
  VNVDApi.detect();
})();
