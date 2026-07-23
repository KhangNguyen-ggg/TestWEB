/**
 * VNVD — Admin Module (kết nối backend + fallback localStorage)
 * - Chỉ tài khoản role='admin' mới mở được bảng điều khiển.
 * - ONLINE:  nạp users / services / orders / stats từ API /api/admin/*.
 * - OFFLINE: dùng dữ liệu localStorage như bản demo cũ.
 */
(function () {
  'use strict';

  const panel        = document.getElementById('adminPanel');
  const openBtn      = document.getElementById('openAdminBtn');
  const closeBtn     = document.getElementById('adminClose');
  const usersBody    = document.getElementById('adminUsersBody');
  const servicesBody = document.getElementById('adminServicesBody');
  const ordersBody   = document.getElementById('adminOrdersBody');

  const Api = window.VNVDApi || null;
  function isOnline() { return !!(Api && Api.available && Api.getToken()); }

  /* ---- Dữ liệu dịch vụ (dùng cho chế độ OFFLINE, đồng bộ với trang chủ) ---- */
  const SERVICES = [
    { id: 'svc-001', name: 'Cloud Computing',          price: 2500000 },
    { id: 'svc-002', name: 'Bảo mật & An toàn số',     price: 1800000 },
    { id: 'svc-003', name: 'AI & Tự động hóa',         price: 3200000 },
    { id: 'svc-004', name: 'Hạ tầng mạng 5G',          price: 4500000 },
    { id: 'svc-005', name: 'Quản trị doanh nghiệp số', price: 990000  },
    { id: 'svc-006', name: 'Giao tiếp & Cộng tác',     price: 750000  },
    { id: 'svc-007', name: 'Big Data & Phân tích',     price: 2100000 },
    { id: 'svc-008', name: 'IoT & Smart City',         price: 1500000 },
    { id: 'pkg-basic',    name: 'Gói Cơ bản',      price: 990000  },
    { id: 'pkg-business', name: 'Gói Doanh nghiệp', price: 2900000 },
    { id: 'pkg-premium',  name: 'Gói Cao cấp',      price: 7500000 }
  ];

  function fmt(n) { return (n || 0).toLocaleString('vi-VN') + ' ₫'; }
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function guard() {
    const ok = window.VNVDAuth && window.VNVDAuth.isAdmin && window.VNVDAuth.isAdmin();
    return !!ok;
  }

  function getUsersLocal() {
    try {
      if (window.VNVDAuth && window.VNVDAuth.getUsers) return window.VNVDAuth.getUsers();
      return JSON.parse(localStorage.getItem('vnvd_users') || '[]');
    } catch { return []; }
  }
  function getCartLocal() {
    try { return JSON.parse(localStorage.getItem('vnvd_cart') || '[]'); }
    catch { return []; }
  }

  function setStat(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  }

  /* ============ RENDER — ONLINE (từ API) ============ */
  async function renderOnline() {
    try {
      const [{ users }, { products }, { orders }, { stats }] = await Promise.all([
        Api.adminUsers(),
        Api.adminProducts(),
        Api.adminOrders(),
        Api.adminStats(),
      ]);

      // Users
      if (usersBody) {
        usersBody.innerHTML = users.length
          ? users.map(u => {
              const name = `${esc(u.firstName || '')} ${esc(u.lastName || '')}`.trim() || '—';
              const tag = '<span class="admin-tag blue">Khách hàng</span>';
              return `<tr><td>${name}</td><td>${esc(u.email)}</td><td>${esc(u.phone || '—')}</td><td>${tag}</td></tr>`;
            }).join('')
          : '<tr><td colspan="4" class="admin-empty">Chưa có người dùng.</td></tr>';
      }

      // Services
      if (servicesBody) {
        servicesBody.innerHTML = products.map(s => {
          const stTag = s.status === 'dang_ban' ? '<span class="admin-tag green">Đang bán</span>' : '<span class="admin-tag orange">Ngừng/Sắp ra mắt</span>';
          return `<tr>
            <td>${esc(s.id)}</td>
            <td>${esc(s.name)}</td>
            <td>${fmt(s.listPrice || s.price)}</td>
            <td>${stTag}</td>
            <td>
               <button class="btn-action edit-sp" data-dbid="${s.dbId}" style="cursor:pointer; color: #0066CC; background: none; border: none;"><i data-lucide="pen"></i> Sửa</button>
               <button class="btn-action del-sp" data-dbid="${s.dbId}" style="cursor:pointer; color: #E53E3E; background: none; border: none;"><i data-lucide="trash"></i> Xóa</button>
            </td>
          </tr>`;
        }).join('');

        // GẮN SỰ KIỆN NÚT XÓA TRỰC TIẾP
        document.querySelectorAll('.del-sp').forEach(btn => {
           btn.addEventListener('click', async () => {
              if(!confirm('Bạn có chắc muốn xóa sản phẩm này?')) return;
              try {
                 await Api.adminDeleteProduct(btn.dataset.dbid);
                 alert('Đã xóa thành công!');
                 renderOnline(); // Render lại bảng
              } catch(e) { alert(e.message); }
           });
        });

        // GẮN SỰ KIỆN NÚT SỬA (Hiện form lấy thông tin)
        // ... (Bạn có thể tự tạo Modal bằng thẻ <div> như bên auth_3.js rồi dùng JS để gán data-dbid vào form)
      }

      // Orders
      if (ordersBody) {
        ordersBody.innerHTML = orders.length
          ? orders.map(o => {
              const st = o.trang_thai_don_hang || 'cho_xac_nhan';
              const stTag = st === 'hoan_thanh'
                ? '<span class="admin-tag green">Hoàn thành</span>'
                : (st === 'da_huy'
                    ? '<span class="admin-tag orange">Đã hủy</span>'
                    : '<span class="admin-tag orange">Chờ xử lý</span>');
              return `<tr><td>#${esc(o.ma_don_hang)}</td><td>${esc(o.khach_hang || '—')}</td><td>—</td><td>${fmt(Number(o.tong_thanh_toan))}</td><td>${stTag}</td></tr>`;
            }).join('')
          : '<tr><td colspan="5" class="admin-empty">Chưa có đơn hàng nào.</td></tr>';
      }

      // Stats
      setStat('statUsers', stats.users);
      setStat('statServices', stats.services);
      setStat('statOrders', stats.orders);
      setStat('statRevenue', fmt(stats.revenue));

      if (window.lucide) lucide.createIcons();
    } catch (err) {
      // Nếu API lỗi (vd mất mạng), rơi về offline
      console.warn('Admin API lỗi, dùng dữ liệu cục bộ:', err.message);
      renderOffline();
    }
  }

  /* ============ RENDER — OFFLINE (localStorage) ============ */
  function renderOffline() {
    // Users
    if (usersBody) {
      const users = getUsersLocal();
      usersBody.innerHTML = users.length
        ? users.map(u => {
            const role = u.role || 'customer';
            const tag = role === 'admin'
              ? '<span class="admin-tag orange">Quản trị viên</span>'
              : '<span class="admin-tag blue">Khách hàng</span>';
            const name = `${esc(u.firstName || '')} ${esc(u.lastName || '')}`.trim() || '—';
            return `<tr><td>${name}</td><td>${esc(u.email)}</td><td>${esc(u.phone || '—')}</td><td>${tag}</td></tr>`;
          }).join('')
        : '<tr><td colspan="4" class="admin-empty">Chưa có người dùng.</td></tr>';
      setStat('statUsers', users.length);
    }
    // Services
    if (servicesBody) {
      servicesBody.innerHTML = SERVICES.map(s =>
        `<tr><td>${esc(s.id)}</td><td>${esc(s.name)}</td><td>${fmt(s.price)}</td><td><span class="admin-tag green">Đang bán</span></td></tr>`
      ).join('');
      setStat('statServices', SERVICES.length);
    }
    // Orders (từ giỏ hàng demo)
    if (ordersBody) {
      const cart = getCartLocal();
      if (!cart.length) {
        ordersBody.innerHTML = '<tr><td colspan="5" class="admin-empty">Chưa có đơn hàng nào trong giỏ (demo).</td></tr>';
        setStat('statOrders', '0');
        setStat('statRevenue', fmt(0));
      } else {
        let total = 0;
        ordersBody.innerHTML = cart.map((item, i) => {
          const qty = item.qty || 1;
          const line = (item.price || 0) * qty;
          total += line;
          return `<tr><td>#DH${String(1000 + i)}</td><td>${esc(item.name)}</td><td>${qty}</td><td>${fmt(line)}</td><td><span class="admin-tag orange">Chờ xử lý</span></td></tr>`;
        }).join('');
        setStat('statOrders', cart.length);
        setStat('statRevenue', fmt(total));
      }
    }
  }

  function renderAll() {
    if (isOnline()) renderOnline();
    else renderOffline();
    if (window.lucide) lucide.createIcons();
  }

  /* ---- Mở / đóng panel ---- */
  function openPanel() {
    if (!guard()) {
      const toast = document.getElementById('toast');
      const toastMsg = document.getElementById('toastMsg');
      if (toast && toastMsg) {
        toastMsg.textContent = 'Bạn không có quyền truy cập khu vực quản trị.';
        toast.style.background = '#E53E3E';
        toast.classList.add('show');
        setTimeout(() => { toast.classList.remove('show'); toast.style.background = ''; }, 3000);
      }
      return;
    }
    renderAll();
    panel?.classList.add('open');
    document.body.style.overflow = 'hidden';
    document.getElementById('userMenu')?.classList.remove('open');
  }

  function closePanel() {
    panel?.classList.remove('open');
    document.body.style.overflow = '';
  }

  openBtn?.addEventListener('click', openPanel);
  closeBtn?.addEventListener('click', closePanel);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && panel?.classList.contains('open')) closePanel();
  });

  /* ---- Tabs ---- */
  document.querySelectorAll('.admin-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const key = tab.getAttribute('data-tab');
      document.querySelectorAll('.admin-tab').forEach(t => t.classList.toggle('active', t === tab));
      document.querySelectorAll('.admin-tab-panel').forEach(p =>
        p.classList.toggle('active', p.getAttribute('data-panel') === key)
      );
    });
  });

  /* ---- Khi trạng thái đăng nhập đổi ---- */
  document.addEventListener('vnvd:authchange', () => {
    if (!guard()) closePanel();
    else if (panel?.classList.contains('open')) renderAll();
  });

})();
