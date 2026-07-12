/**
 * VNVD — Auth Module (kết nối backend + fallback localStorage)
 * Handles: Login, Register, Logout, User menu, Password strength, Form validation
 *
 * Chế độ hoạt động:
 *  - ONLINE  (có backend /api): gọi VNVDApi.register/login/me, lưu JWT + user.
 *  - OFFLINE (bản tĩnh, không backend): tự chuyển sang localStorage như bản demo cũ.
 */
(function () {
  'use strict';

  /* ---- DOM refs ---- */
  const loginModal      = document.getElementById('loginModal');
  const registerModal   = document.getElementById('registerModal');
  const modalOverlay    = document.getElementById('modalOverlay');
  const openLoginBtn    = document.getElementById('openLogin');
  const openRegisterBtn = document.getElementById('openRegister');
  const closeLoginBtn   = document.getElementById('closeLogin');
  const closeRegisterBtn= document.getElementById('closeRegister');
  const switchToReg     = document.getElementById('switchToRegister');
  const switchToLog     = document.getElementById('switchToLogin');
  const authBtns        = document.getElementById('authBtns');
  const userMenu        = document.getElementById('userMenu');
  const userAvatarBtn   = document.getElementById('userAvatarBtn');
  const userDropdown    = document.getElementById('userDropdown');
  const userAvatarCircle= document.getElementById('userAvatarCircle');
  const userDisplayName = document.getElementById('userDisplayName');
  const userDropdownName= document.getElementById('userDropdownName');
  const userDropdownEmail=document.getElementById('userDropdownEmail');
  const logoutBtn       = document.getElementById('logoutBtn');
  const loginForm       = document.getElementById('loginForm');
  const registerForm    = document.getElementById('registerForm');
  const loginError      = document.getElementById('loginError');
  const registerError   = document.getElementById('registerError');
  const pwStrengthFill  = document.getElementById('pwStrengthFill');
  const pwStrengthLabel = document.getElementById('pwStrengthLabel');
  const regPassword     = document.getElementById('regPassword');

  /* ---- Backend availability ---- */
  const Api = window.VNVDApi || null;
  // true nếu đã dò được backend sống. Nếu chưa dò xong, chờ tối đa ~2.5s.
  async function backendReady() {
    if (!Api) return false;
    if (Api.available === null) {
      try { await Api.detect(); } catch (_e) { /* ignore */ }
    }
    return !!Api.available;
  }

  /* ---- Helpers ---- */
  function showToast(msg, isError) {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toastMsg');
    if (!toast || !toastMsg) return;
    toastMsg.textContent = msg;
    toast.style.background = isError ? '#E53E3E' : '';
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
  }

  function setFieldError(inputId, errId, msg) {
    const input = document.getElementById(inputId);
    const err   = document.getElementById(errId);
    if (input) input.classList.toggle('error', !!msg);
    if (err)   err.textContent = msg || '';
  }

  function clearErrors(...errIds) {
    errIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = '';
    });
    document.querySelectorAll('.auth-input-wrap input.error').forEach(el => el.classList.remove('error'));
  }

  /* ---- localStorage helpers (dùng cho fallback OFFLINE + lưu user hiện tại) ---- */
  function getUsers() {
    try { return JSON.parse(localStorage.getItem('vnvd_users') || '[]'); }
    catch { return []; }
  }
  function saveUsers(users) {
    localStorage.setItem('vnvd_users', JSON.stringify(users));
  }
  function getCurrentUser() {
    try { return JSON.parse(localStorage.getItem('vnvd_user') || 'null'); }
    catch { return null; }
  }
  function setCurrentUser(user) {
    if (user) localStorage.setItem('vnvd_user', JSON.stringify(user));
    else localStorage.removeItem('vnvd_user');
  }

  /* ---- Seed default ADMIN account (chỉ cho chế độ OFFLINE demo) ---- */
  function seedAdmin() {
    const users = getUsers();
    if (!users.find(u => u.email === 'admin@vnvd.vn')) {
      users.push({
        id: 'admin-root',
        firstName: 'Quản trị',
        lastName: 'viên',
        email: 'admin@vnvd.vn',
        phone: '1800 1260',
        password: 'admin123',
        role: 'admin'
      });
      saveUsers(users);
    }
  }
  seedAdmin();

  /* ---- Role helpers (exposed for admin.js) ---- */
  function isAdmin() {
    const u = getCurrentUser();
    return !!(u && u.role === 'admin');
  }
  window.VNVDAuth = { getCurrentUser, isAdmin, getUsers };

  /* ---- Modal open/close ---- */
  function openModal(modal) {
    modal?.classList.add('open');
    modalOverlay?.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function closeModal(modal) {
    modal?.classList.remove('open');
    const anyOpen = document.querySelector('.auth-modal.open');
    if (!anyOpen) {
      modalOverlay?.classList.remove('active');
      document.body.style.overflow = '';
    }
  }
  function closeAllModals() {
    loginModal?.classList.remove('open');
    registerModal?.classList.remove('open');
    modalOverlay?.classList.remove('active');
    document.body.style.overflow = '';
  }

  /* ---- UI state: logged in / out ---- */
  function updateAuthUI() {
    const user = getCurrentUser();
    if (user) {
      authBtns && (authBtns.style.display = 'none');
      userMenu && (userMenu.style.display = 'flex');
      const initials = ((user.firstName || '')[0] + (user.lastName || '')[0]).toUpperCase() || 'U';
      if (userAvatarCircle) userAvatarCircle.textContent = initials;
      const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email;
      const role = user.role || 'customer';
      const roleLabel = role === 'admin' ? 'Quản trị viên' : 'Khách hàng';
      if (userDisplayName) userDisplayName.textContent = fullName;
      if (userDropdownName) {
        userDropdownName.innerHTML = `${fullName} <span class="role-badge ${role}">${roleLabel}</span>`;
      }
      if (userDropdownEmail) userDropdownEmail.textContent = user.email;
      document.body.classList.toggle('is-admin', role === 'admin');
    } else {
      authBtns && (authBtns.style.display = 'flex');
      userMenu && (userMenu.style.display = 'none');
      document.body.classList.remove('is-admin');
    }
    document.dispatchEvent(new CustomEvent('vnvd:authchange'));
    if (window.lucide) lucide.createIcons();
  }

  /* ---- Password strength ---- */
  function checkPasswordStrength(pw) {
    let score = 0;
    if (pw.length >= 8)  score++;
    if (pw.length >= 12) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;

    const levels = [
      { label: 'Rất yếu',  color: '#E53E3E', pct: '20%' },
      { label: 'Yếu',      color: '#ED8936', pct: '40%' },
      { label: 'Trung bình',color: '#ECC94B', pct: '60%' },
      { label: 'Mạnh',     color: '#48BB78', pct: '80%' },
      { label: 'Rất mạnh', color: '#38A169', pct: '100%' },
    ];
    const lvl = levels[Math.min(score, 4)];
    if (pwStrengthFill) {
      pwStrengthFill.style.width      = pw.length ? lvl.pct : '0%';
      pwStrengthFill.style.background = lvl.color;
    }
    if (pwStrengthLabel) {
      pwStrengthLabel.textContent = pw.length ? lvl.label : 'Độ mạnh mật khẩu';
      pwStrengthLabel.style.color = pw.length ? lvl.color : '';
    }
    return score;
  }

  /* ---- Toggle password visibility ---- */
  document.querySelectorAll('.toggle-pw').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.target;
      const input = document.getElementById(targetId);
      if (!input) return;
      const isText = input.type === 'text';
      input.type = isText ? 'password' : 'text';
      btn.innerHTML = isText
        ? '<i data-lucide="eye"></i>'
        : '<i data-lucide="eye-off"></i>';
      if (window.lucide) lucide.createIcons();
    });
  });

  /* ---- Login form ---- */
  loginForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors('loginEmailErr', 'loginPasswordErr');
    if (loginError) loginError.style.display = 'none';

    const email    = document.getElementById('loginEmail')?.value.trim();
    const password = document.getElementById('loginPassword')?.value;
    let valid = true;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFieldError('loginEmail', 'loginEmailErr', 'Email không hợp lệ');
      valid = false;
    }
    if (!password || password.length < 6) {
      setFieldError('loginPassword', 'loginPasswordErr', 'Mật khẩu tối thiểu 6 ký tự');
      valid = false;
    }
    if (!valid) return;

    const submitBtn = document.getElementById('loginSubmit');
    if (submitBtn) { submitBtn.disabled = true; submitBtn.classList.add('loading'); }

    const finish = () => { if (submitBtn) { submitBtn.disabled = false; submitBtn.classList.remove('loading'); } };
    const failLogin = (msg) => {
      finish();
      if (loginError) { loginError.textContent = msg; loginError.style.display = 'block'; }
    };

    if (await backendReady()) {
      // ---- ONLINE: gọi API ----
      try {
        const { token, user } = await Api.login(email, password);
        Api.setToken(token);
        setCurrentUser(user);
        finish();
        updateAuthUI();
        closeAllModals();
        loginForm.reset();
        showToast(`Chào mừng trở lại, ${user.firstName || user.email}! 👋`);
      } catch (err) {
        failLogin(err.message || 'Email hoặc mật khẩu không đúng. Vui lòng thử lại.');
      }
      return;
    }

    // ---- OFFLINE: localStorage ----
    setTimeout(() => {
      const users = getUsers();
      const user  = users.find(u => u.email === email && u.password === password);
      if (!user) { failLogin('Email hoặc mật khẩu không đúng. Vui lòng thử lại.'); return; }
      finish();
      setCurrentUser(user);
      updateAuthUI();
      closeAllModals();
      loginForm.reset();
      showToast(`Chào mừng trở lại, ${user.firstName || user.email}! 👋`);
    }, 700);
  });

  /* ---- Register form ---- */
  registerForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors('regFirstNameErr','regLastNameErr','regEmailErr','regPhoneErr','regPasswordErr','regConfirmPasswordErr','agreeTermsErr');
    if (registerError) registerError.style.display = 'none';

    const firstName = document.getElementById('regFirstName')?.value.trim();
    const lastName  = document.getElementById('regLastName')?.value.trim();
    const email     = document.getElementById('regEmail')?.value.trim();
    const phone     = document.getElementById('regPhone')?.value.trim();
    const password  = document.getElementById('regPassword')?.value;
    const confirm   = document.getElementById('regConfirmPassword')?.value;
    const agreed    = document.getElementById('agreeTerms')?.checked;
    let valid = true;

    if (!firstName) { setFieldError('regFirstName','regFirstNameErr','Vui lòng nhập họ'); valid = false; }
    if (!lastName)  { setFieldError('regLastName','regLastNameErr','Vui lòng nhập tên'); valid = false; }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFieldError('regEmail','regEmailErr','Email không hợp lệ'); valid = false;
    }
    if (phone && !/^(0|\+84)[0-9]{8,10}$/.test(phone.replace(/\s/g,''))) {
      setFieldError('regPhone','regPhoneErr','Số điện thoại không hợp lệ'); valid = false;
    }
    if (!password || password.length < 8) {
      setFieldError('regPassword','regPasswordErr','Mật khẩu tối thiểu 8 ký tự'); valid = false;
    }
    if (password !== confirm) {
      setFieldError('regConfirmPassword','regConfirmPasswordErr','Mật khẩu xác nhận không khớp'); valid = false;
    }
    if (!agreed) {
      const err = document.getElementById('agreeTermsErr');
      if (err) err.textContent = 'Bạn cần đồng ý với điều khoản dịch vụ';
      valid = false;
    }
    if (!valid) return;

    const submitBtn = document.getElementById('registerSubmit');
    if (submitBtn) { submitBtn.disabled = true; submitBtn.classList.add('loading'); }
    const finish = () => { if (submitBtn) { submitBtn.disabled = false; submitBtn.classList.remove('loading'); } };
    const failReg = (msg) => {
      finish();
      if (registerError) { registerError.textContent = msg; registerError.style.display = 'block'; }
    };
    const succeed = (user) => {
      finish();
      setCurrentUser(user);
      updateAuthUI();
      closeAllModals();
      registerForm.reset();
      checkPasswordStrength('');
      showToast(`Đăng ký thành công! Chào mừng ${user.firstName} đến với VNVD 🎉`);
    };

    if (await backendReady()) {
      // ---- ONLINE: gọi API ----
      try {
        const { token, user } = await Api.register({ firstName, lastName, email, phone, password });
        Api.setToken(token);
        succeed(user);
      } catch (err) {
        failReg(err.message || 'Đăng ký thất bại. Vui lòng thử lại.');
      }
      return;
    }

    // ---- OFFLINE: localStorage ----
    setTimeout(() => {
      const users = getUsers();
      if (users.find(u => u.email === email)) {
        failReg('Email này đã được đăng ký. Vui lòng đăng nhập hoặc dùng email khác.');
        return;
      }
      const newUser = { id: Date.now(), firstName, lastName, email, phone, password, role: 'customer' };
      users.push(newUser);
      saveUsers(users);
      succeed(newUser);
    }, 800);
  });

  /* ---- Password strength live ---- */
  regPassword?.addEventListener('input', () => checkPasswordStrength(regPassword.value));

  /* ---- Logout ---- */
  logoutBtn?.addEventListener('click', () => {
    setCurrentUser(null);
    if (Api) Api.setToken('');
    updateAuthUI();
    userMenu?.classList.remove('open');
    showToast('Đã đăng xuất thành công');
  });

  /* ---- User dropdown toggle ---- */
  userAvatarBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    userMenu?.classList.toggle('open');
  });
  document.addEventListener('click', (e) => {
    if (!userMenu?.contains(e.target)) userMenu?.classList.remove('open');
  });

  /* ---- Modal triggers ---- */
  openLoginBtn?.addEventListener('click',    () => openModal(loginModal));
  openRegisterBtn?.addEventListener('click', () => openModal(registerModal));
  closeLoginBtn?.addEventListener('click',   () => closeModal(loginModal));
  closeRegisterBtn?.addEventListener('click',() => closeModal(registerModal));
  modalOverlay?.addEventListener('click',    closeAllModals);

  switchToReg?.addEventListener('click', () => {
    closeModal(loginModal);
    setTimeout(() => openModal(registerModal), 150);
  });
  switchToLog?.addEventListener('click', () => {
    closeModal(registerModal);
    setTimeout(() => openModal(loginModal), 150);
  });

  /* ---- Social login (demo — chỉ hoạt động chế độ OFFLINE) ---- */
  document.getElementById('loginGoogle')?.addEventListener('click', () => {
    const demoUser = { id: 'google-demo', firstName: 'Google', lastName: 'User', email: 'google.user@gmail.com', phone: '', role: 'customer' };
    setCurrentUser(demoUser);
    updateAuthUI();
    closeAllModals();
    showToast('Đăng nhập bằng Google thành công! 🎉');
  });
  document.getElementById('loginFacebook')?.addEventListener('click', () => {
    const demoUser = { id: 'fb-demo', firstName: 'Facebook', lastName: 'User', email: 'fb.user@facebook.com', phone: '', role: 'customer' };
    setCurrentUser(demoUser);
    updateAuthUI();
    closeAllModals();
    showToast('Đăng nhập bằng Facebook thành công! 🎉');
  });

  /* ---- Forgot password (demo) ---- */
  document.getElementById('forgotLink')?.addEventListener('click', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail')?.value.trim();
    if (!email) {
      setFieldError('loginEmail','loginEmailErr','Nhập email để khôi phục mật khẩu');
      return;
    }
    showToast(`Đã gửi link khôi phục đến ${email} 📧`);
  });

  /* ---- Keyboard: Escape closes modals ---- */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllModals();
  });

  /* ---- Khôi phục phiên đăng nhập từ token (ONLINE) ---- */
  async function restoreSession() {
    if (await backendReady() && Api.getToken()) {
      try {
        const { user } = await Api.me();
        setCurrentUser(user);
      } catch (_e) {
        // token hỏng/hết hạn → đăng xuất cục bộ
        Api.setToken('');
        setCurrentUser(null);
      }
    }
    updateAuthUI();
  }

  /* ---- Init ---- */
  document.addEventListener('DOMContentLoaded', () => {
    restoreSession();
    if (window.lucide) lucide.createIcons();
  });
  // Nếu DOM đã sẵn sàng (script nạp sau DOMContentLoaded), gọi luôn.
  if (document.readyState !== 'loading') restoreSession();

})();
