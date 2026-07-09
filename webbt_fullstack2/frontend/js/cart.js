/**
 * VNVD — Cart Module (kết nối backend + fallback localStorage)
 * Handles: add/remove/update items, sidebar open/close, badge, persistence.
 *
 * Nguyên tắc:
 *  - localStorage 'vnvd_cart' luôn là nguồn render tức thời (UX mượt, chạy offline).
 *  - Khi ONLINE + đã đăng nhập khách hàng: mọi thao tác được đồng bộ lên backend,
 *    và khi đăng nhập sẽ tải giỏ hàng từ server về.
 *  - Checkout: ONLINE gọi POST /api/orders; OFFLINE giữ hành vi demo cũ.
 */
(function () {
  'use strict';

  /* ---- State ---- */
  let cart = loadCart();
  const Api = window.VNVDApi || null;

  /* ---- DOM refs ---- */
  const cartToggle  = document.getElementById('cartToggle');
  const cartSidebar = document.getElementById('cartSidebar');
  const cartOverlay = document.getElementById('cartOverlay');
  const cartClose   = document.getElementById('cartClose');
  const cartBadge   = document.getElementById('cartBadge');
  const cartEmpty   = document.getElementById('cartEmpty');
  const cartItems   = document.getElementById('cartItems');
  const cartFooter  = document.getElementById('cartFooter');
  const cartCount   = document.getElementById('cartCount');
  const cartSubtotal= document.getElementById('cartSubtotal');
  const cartTotal   = document.getElementById('cartTotal');
  const clearCartBtn= document.getElementById('clearCartBtn');
  const checkoutBtn = document.getElementById('checkoutBtn');

  /* ---- Helpers ---- */
  function loadCart() {
    try { return JSON.parse(localStorage.getItem('vnvd_cart') || '[]'); }
    catch { return []; }
  }
  function saveCart() {
    localStorage.setItem('vnvd_cart', JSON.stringify(cart));
  }
  function formatPrice(n) {
    return n.toLocaleString('vi-VN') + ' ₫';
  }
  function showToast(msg, isError) {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toastMsg');
    if (!toast || !toastMsg) return;
    toastMsg.textContent = msg;
    toast.style.background = isError ? '#E53E3E' : '';
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
  }

  /* ---- Backend / auth helpers ---- */
  function isOnline() { return !!(Api && Api.available); }
  function currentUser() {
    try { return JSON.parse(localStorage.getItem('vnvd_user') || 'null'); }
    catch { return null; }
  }
  // Chỉ đồng bộ backend khi ONLINE và người dùng là khách hàng đã đăng nhập.
  function canSync() {
    const u = currentUser();
    return isOnline() && !!(u && (u.role === 'customer' || !u.role) && Api.getToken());
  }

  /* ---- Badge ---- */
  function updateBadge() {
    const total = cart.reduce((s, i) => s + i.qty, 0);
    if (!cartBadge) return;
    if (total > 0) {
      cartBadge.textContent = total > 99 ? '99+' : total;
      cartBadge.style.display = 'flex';
    } else {
      cartBadge.style.display = 'none';
    }
  }

  /* ---- Render cart items ---- */
  function renderCart() {
    if (!cartItems) return;
    cartItems.innerHTML = '';

    if (cart.length === 0) {
      if (cartEmpty)  cartEmpty.style.display  = 'flex';
      if (cartFooter) cartFooter.style.display = 'none';
      return;
    }

    if (cartEmpty)  cartEmpty.style.display  = 'none';
    if (cartFooter) cartFooter.style.display = 'block';

    let subtotal = 0;
    cart.forEach(item => {
      subtotal += item.price * item.qty;
      const el = document.createElement('div');
      el.className = 'cart-item';
      el.dataset.id = item.id;
      el.innerHTML = `
        <div class="cart-item-icon" style="background:${item.color}">
          <i data-lucide="${item.icon}"></i>
        </div>
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">${formatPrice(item.price)}/tháng</div>
          <div class="cart-item-controls">
            <button class="qty-btn qty-minus" data-id="${item.id}" aria-label="Giảm">−</button>
            <span class="qty-value">${item.qty}</span>
            <button class="qty-btn qty-plus" data-id="${item.id}" aria-label="Tăng">+</button>
          </div>
        </div>
        <button class="cart-item-remove" data-id="${item.id}" aria-label="Xóa">
          <i data-lucide="trash-2"></i>
        </button>
      `;
      cartItems.appendChild(el);
    });

    if (window.lucide) lucide.createIcons();

    if (cartCount)    cartCount.textContent    = cart.reduce((s, i) => s + i.qty, 0);
    if (cartSubtotal) cartSubtotal.textContent = formatPrice(subtotal);
    if (cartTotal)    cartTotal.textContent    = formatPrice(subtotal);

    cartItems.querySelectorAll('.qty-minus').forEach(btn => {
      btn.addEventListener('click', () => changeQty(btn.dataset.id, -1));
    });
    cartItems.querySelectorAll('.qty-plus').forEach(btn => {
      btn.addEventListener('click', () => changeQty(btn.dataset.id, +1));
    });
    cartItems.querySelectorAll('.cart-item-remove').forEach(btn => {
      btn.addEventListener('click', () => removeItem(btn.dataset.id));
    });
  }

  /* ---- Cart operations (local render + đồng bộ backend nếu được) ---- */
  function addItem(id, name, price, icon, color) {
    const existing = cart.find(i => i.id === id);
    if (existing) {
      existing.qty += 1;
      showToast(`Đã tăng số lượng "${name}" lên ${existing.qty}`);
    } else {
      cart.push({ id, name, price: parseInt(price, 10), icon, color, qty: 1 });
      showToast(`Đã thêm "${name}" vào giỏ hàng 🛒`);
    }
    saveCart();
    updateBadge();
    renderCart();
    if (canSync()) Api.addToCart(id, 1).catch(() => {/* offline-safe */});
  }

  function changeQty(id, delta) {
    const item = cart.find(i => i.id === id);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) {
      removeItem(id);
      return;
    }
    saveCart();
    updateBadge();
    renderCart();
    if (canSync()) Api.setCartQty(id, item.qty).catch(() => {});
  }

  function removeItem(id) {
    const item = cart.find(i => i.id === id);
    if (item) showToast(`Đã xóa "${item.name}" khỏi giỏ hàng`);
    cart = cart.filter(i => i.id !== id);
    saveCart();
    updateBadge();
    renderCart();
    if (canSync()) Api.removeFromCart(id).catch(() => {});
  }

  function clearCart(silent) {
    cart = [];
    saveCart();
    updateBadge();
    renderCart();
    if (!silent) showToast('Đã xóa toàn bộ giỏ hàng');
    if (canSync()) Api.clearCart().catch(() => {});
  }

  /* ---- Đồng bộ giỏ hàng khi đăng nhập (ONLINE) ---- */
  async function syncFromServer() {
    if (!canSync()) return;
    try {
      // Đẩy các item đang có ở local (khách thêm lúc chưa đăng nhập) lên server trước.
      for (const it of cart) {
        try { await Api.setCartQty(it.id, it.qty); } catch (_e) {}
      }
      // Sau đó lấy giỏ hàng "chuẩn" từ server về.
      const { items } = await Api.getCart();
      if (Array.isArray(items)) {
        cart = items;
        saveCart();
        updateBadge();
        renderCart();
      }
    } catch (_e) { /* offline-safe */ }
  }
  document.addEventListener('vnvd:authchange', () => {
    // Chỉ đồng bộ khi có đăng nhập khách hàng; đăng xuất thì giữ giỏ local.
    if (canSync()) syncFromServer();
  });

  /* ---- Sidebar open/close ---- */
  function openCart() {
    cartSidebar?.classList.add('open');
    cartOverlay?.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function closeCart() {
    cartSidebar?.classList.remove('open');
    cartOverlay?.classList.remove('active');
    document.body.style.overflow = '';
  }

  /* ---- Event listeners ---- */
  cartToggle?.addEventListener('click', openCart);
  cartClose?.addEventListener('click', closeCart);
  cartOverlay?.addEventListener('click', closeCart);
  clearCartBtn?.addEventListener('click', () => clearCart(false));

  checkoutBtn?.addEventListener('click', async () => {
    if (cart.length === 0) return;
    const user = currentUser();
    if (!user) {
      closeCart();
      showToast('Vui lòng đăng nhập để thanh toán', true);
      setTimeout(() => document.getElementById('loginModal')?.classList.add('open'), 400);
      document.getElementById('modalOverlay')?.classList.add('active');
      return;
    }

    // ONLINE: tạo đơn hàng thật
    if (canSync()) {
      try {
        // đảm bảo giỏ trên server khớp local trước khi checkout
        await syncFromServer();
        const { order } = await Api.checkout();
        showToast(`🎉 Đặt hàng thành công! Mã đơn ${order.ma_don_hang}. Chúng tôi sẽ liên hệ trong 24h.`);
        clearCart(true);
        closeCart();
      } catch (err) {
        showToast(err.message || 'Không tạo được đơn hàng. Vui lòng thử lại.', true);
      }
      return;
    }

    // OFFLINE: hành vi demo cũ
    showToast('🎉 Đặt hàng thành công! Chúng tôi sẽ liên hệ trong 24h.');
    clearCart(true);
    closeCart();
  });

  /* ---- "Add to cart" buttons on service cards ---- */
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-add-cart');
    if (!btn) return;
    const { id, name, price, icon, color } = btn.dataset;
    addItem(id, name, price, icon, color);

    btn.classList.add('added');
    const origHTML = btn.innerHTML;
    btn.innerHTML = '<i data-lucide="check"></i> Đã thêm!';
    if (window.lucide) lucide.createIcons();
    setTimeout(() => {
      btn.innerHTML = origHTML;
      btn.classList.remove('added');
      if (window.lucide) lucide.createIcons();
    }, 1800);
  });

  /* ---- Init ---- */
  document.addEventListener('DOMContentLoaded', () => {
    updateBadge();
    renderCart();
    // Nếu đã đăng nhập sẵn (reload trang), đồng bộ giỏ từ server.
    setTimeout(() => { if (canSync()) syncFromServer(); }, 800);
  });

  window.VNVD_Cart = { openCart, closeCart };

})();
