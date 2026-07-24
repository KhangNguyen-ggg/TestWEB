/**
 * VNVD — API Client (window.VNVDApi)
 * Lớp giao tiếp với backend REST API.
 * Tự động phát hiện backend qua /api/health.
 * Gắn Bearer JWT token vào mọi request khi đã đăng nhập.
 */
(function () {
  'use strict';

  // Tự động dùng origin hiện tại (khi chạy qua Node server) hoặc localhost:3000
  //(location.hostname === 'localhost' || location.hostname === '127.0.0.1')
  //  ? `${location.protocol}//${location.hostname}:${location.port || 3000}`
  //  : '';
  const BASE = "https://testweb-3dku.onrender.com";

  const TOKEN_KEY = 'vnvd_token';
  let _available = null;

  function getToken() {
    return localStorage.getItem(TOKEN_KEY) || '';
  }
  function setToken(token) {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  }

  async function req(method, path, body) {
    const headers = { 'Content-Type': 'application/json' };
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const opts = { method, headers };
    if (body !== undefined) opts.body = JSON.stringify(body);
    const res = await fetch(`${BASE}${path}`, opts);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.error || data.message || `HTTP ${res.status}`);
    }
    return data;
  }

  async function detect() {
    try {
      const ctrl = new AbortController();
      const tid = setTimeout(() => ctrl.abort(), 2500);
      await fetch(`${BASE}/api/health`, { signal: ctrl.signal });
      clearTimeout(tid);
      _available = true;
    } catch (_e) {
      _available = false;
    }
    return _available;
  }

  // Auth
  const register = (p) => req('POST', '/api/auth/register', p);
  const login = (email, password) => req('POST', '/api/auth/login', { email, password });
  const me = () => req('GET', '/api/auth/me');

  // Products
  const getProducts = (params) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return req('GET', `/api/products${qs}`);
  };
  const getProduct = (code) => req('GET', `/api/products/${encodeURIComponent(code)}`);

  // Cart
  const getCart = () => req('GET', '/api/cart');
  const addToCart = (code, qty) => req('POST', '/api/cart', { code, qty: qty || 1 });
  const setCartQty = (code, qty) => req('PUT', `/api/cart/${encodeURIComponent(code)}`, { qty });
  const removeFromCart = (code) => req('DELETE', `/api/cart/${encodeURIComponent(code)}`);
  const clearCart = () => req('DELETE', '/api/cart');

  // Orders
  const checkout = (note) => req('POST', '/api/orders', note ? { note } : {});
  const getOrders = () => req('GET', '/api/orders');
  const getOrder = (ma) => req('GET', `/api/orders/${encodeURIComponent(ma)}`);

  // Admin
  const adminStats = () => req('GET', '/api/admin/stats');
  const adminUsers = () => req('GET', '/api/admin/users');
  const adminProducts = () => req('GET', '/api/admin/products');
  const adminOrders = () => req('GET', '/api/admin/orders');

  const adminCreateUser = (p) => req('POST', '/api/admin/users', p);
  const adminUpdateUser = (id, p) => req('PUT', `/api/admin/users/${id}`, p);
  const adminDeleteUser = (id) => req('DELETE', `/api/admin/users/${id}`);

  const adminCreateProduct = (p) => req('POST', '/api/admin/products', p);
  const adminUpdateProduct = (id, p) => req('PUT', `/api/admin/products/${id}`, p);
  const adminDeleteProduct = (id) => req('DELETE', `/api/admin/products/${id}`);

  // Chat
  const sendChat = (message, history) => req('POST', '/api/chat', { message, history: history || [] });


  Object.defineProperty(window, 'VNVDApi', {
    value: {
      get available() { return _available; },
      detect, getToken, setToken,
      register, login, me,
      getProducts, getProduct,
      getCart, addToCart, setCartQty, removeFromCart, clearCart,
      checkout, getOrders, getOrder,
      adminStats, adminUsers, adminProducts, adminOrders,
      adminCreateUser, adminUpdateUser, adminDeleteUser,
      adminCreateProduct, adminUpdateProduct, adminDeleteProduct,
      sendChat, loginGoogle(accessToken) { return request('POST', '/api/auth/google', { token: accessToken }); },
      loginFacebook(accessToken) { return request('POST', '/api/auth/facebook', { token: accessToken }); },
    },
    writable: false,
    configurable: false,
  });

  detect().catch(() => { });
})();
