/**
 * VNVD — Auth Module (kết nối trực tiếp Render API)
 * Handles: Login, Register, Logout, User menu, Password strength, Form validation
 */
(function () {
  'use strict';

  // API URL trên Render
  const API_URL = 'https://testweb-3dku.onrender.com/api/auth';

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

  /* ---- LocalStorage User State ---- */
  function getCurrentUser() {
    try { return JSON.parse(localStorage.getItem('vnvd_user') || 'null'); }
    catch { return null; }
  }
  function setCurrentUser(user) {
    if (user) localStorage.setItem('vnvd_user', JSON.stringify(user));
    else localStorage.removeItem('vnvd_user');
  }
  function getToken() {
    return localStorage.getItem('vnvd_token') || '';
  }
  function setToken(token) {
    if (token) localStorage.setItem('vnvd_token', token);
    else localStorage.removeItem('vnvd_token');
  }

  /* ---- Role helpers (exposed for admin.js) ---- */
  function isAdmin() {
    const u = getCurrentUser();
    return !!(u && u.role === 'admin');
  }
  window.VNVDAuth = { getCurrentUser, isAdmin, getToken };

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
    const token = getToken();

    if (user && token) {
      authBtns && (authBtns.style.display = 'none');
      userMenu && (userMenu.style.display = 'flex');
      
      const firstName = user.firstName || user.name || '';
      const lastName = user.lastName || '';
      const fullName = `${firstName} ${lastName}`.trim() || user.email;
      const initials = (firstName[0] || 'U').toUpperCase();
      const role = user.role || 'customer';
      const roleLabel = role === 'admin' ? 'Quản trị viên' : 'Khách hàng';
      
      if (userAvatarCircle) userAvatarCircle.textContent = initials;
      if (userDisplayName) userDisplayName.textContent = fullName;
      if (userDropdownName) {
        userDropdownName.innerHTML = `${fullName} <span class="role-badge ${role}">${roleLabel}</span>`;
      }
      if (userDropdownEmail) userDropdownEmail.textContent = user.email;
      
      // Quản lý hiển thị nút Admin
      const adminBtn = document.getElementById('openAdminBtn');
      if (adminBtn) adminBtn.style.display = role === 'admin' ? 'flex' : 'none';

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

    // Gọi API Render
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();

      if (response.ok) {
        setToken(data.token);
        setCurrentUser(data.user);
        finish();
        updateAuthUI();
        closeAllModals();
        loginForm.reset();
        showToast(`Chào mừng trở lại, ${data.user.name || data.user.firstName}! 👋`);
      } else {
        failLogin(data.message || data.error || 'Đăng nhập thất bại.');
      }
    } catch (err) {
      console.error(err);
      failLogin('Lỗi mạng: Không thể kết nối máy chủ.');
    }
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

    // Gọi API Render
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email, phone, password })
      });
      const data = await response.json();

      if (response.ok) {
        if (data.token) {
          setToken(data.token);
          setCurrentUser(data.user);
        }
        finish();
        updateAuthUI();
        closeAllModals();
        registerForm.reset();
        checkPasswordStrength('');
        showToast(`Đăng ký thành công! Chào mừng ${firstName} đến với VNVD 🎉`);
      } else {
        failReg(data.message || data.error || 'Đăng ký thất bại.');
      }
    } catch (err) {
      console.error(err);
      failReg('Lỗi mạng: Không thể kết nối máy chủ.');
    }
  });

  /* ---- Password strength live ---- */
  regPassword?.addEventListener('input', () => checkPasswordStrength(regPassword.value));

  /* ---- Logout ---- */
  logoutBtn?.addEventListener('click', () => {
    setCurrentUser(null);
    setToken('');
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

  /* ---- Social login (demo) ---- */
  document.getElementById('loginGoogle')?.addEventListener('click', () => {
    showToast('Chức năng đăng nhập Google đang được bảo trì.', true);
  });
  document.getElementById('loginFacebook')?.addEventListener('click', () => {
    showToast('Chức năng đăng nhập Facebook đang được bảo trì.', true);
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

  /* ---- Khôi phục phiên đăng nhập từ token trên Render ---- */
  async function restoreSession() {
    const token = getToken();
    if (token) {
      try {
        const response = await fetch(`${API_URL}/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setCurrentUser(data.user);
        } else {
          // Token hết hạn hoặc không hợp lệ
          setToken('');
          setCurrentUser(null);
        }
      } catch (err) {
        console.error('Lỗi khôi phục session:', err);
      }
    }
    updateAuthUI();
  }

  /* ---- Init ---- */
  document.addEventListener('DOMContentLoaded', () => {
    restoreSession();
    if (window.lucide) lucide.createIcons();
  });
  if (document.readyState !== 'loading') restoreSession();

})();