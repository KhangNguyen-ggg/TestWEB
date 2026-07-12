<footer class="footer">
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <div class="nav-logo" style="margin-bottom:1rem">
          <div class="logo-icon">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="16" fill="url(#footerLogoGrad)"/>
              <path d="M8 16 L16 8 L24 16 L16 24 Z" fill="white" opacity="0.9"/>
              <circle cx="16" cy="16" r="4" fill="white"/>
              <defs>
                <linearGradient id="footerLogoGrad" x1="0" y1="0" x2="32" y2="32">
                  <stop offset="0%" stop-color="#0066CC"/>
                  <stop offset="100%" stop-color="#00AAFF"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span class="logo-text">VNVD</span>
        </div>
        <p>Nền tảng dịch vụ số toàn diện, đồng hành cùng doanh nghiệp Việt Nam trên hành trình chuyển đổi số.</p>
        <div class="social-links">
          <a href="#" aria-label="Facebook"><i data-lucide="facebook"></i></a>
          <a href="#" aria-label="Youtube"><i data-lucide="youtube"></i></a>
          <a href="#" aria-label="Linkedin"><i data-lucide="linkedin"></i></a>
          <a href="#" aria-label="Twitter"><i data-lucide="twitter"></i></a>
        </div>
      </div>
      <div class="footer-col">
        <h4>Dịch vụ</h4>
        <ul>
          <li><a href="#">Cloud Computing</a></li>
          <li><a href="#">Bảo mật số</a></li>
          <li><a href="#">AI & Automation</a></li>
          <li><a href="#">Hạ tầng 5G</a></li>
          <li><a href="#">Quản trị DN</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Giải pháp</h4>
        <ul>
          <li><a href="#">Doanh nghiệp SME</a></li>
          <li><a href="#">Tập đoàn lớn</a></li>
          <li><a href="#">Chính phủ số</a></li>
          <li><a href="#">Y tế số</a></li>
          <li><a href="#">Giáo dục số</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Hỗ trợ</h4>
        <ul>
          <li><a href="#">Tài liệu kỹ thuật</a></li>
          <li><a href="#">Trung tâm hỗ trợ</a></li>
          <li><a href="#">Chính sách bảo mật</a></li>
          <li><a href="#">Điều khoản dịch vụ</a></li>
          <li><a href="#">Liên hệ</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <p>© 2025 VNVD. Bảo lưu mọi quyền. | Giấy phép kinh doanh số: 0100686209</p>
      <div class="footer-badges">
        <span class="fbadge"><i data-lucide="shield"></i> ISO 27001</span>
        <span class="fbadge"><i data-lucide="award"></i> Top 10 ICT</span>
      </div>
    </div>
  </div>
</footer>

<div class="modal-overlay" id="modalOverlay"></div>
<div class="cart-overlay" id="cartOverlay"></div>

<aside class="cart-sidebar" id="cartSidebar">
  <div class="cart-header">
    <h3><i data-lucide="shopping-cart"></i> Giỏ hàng</h3>
    <button class="cart-close-btn" id="cartClose" aria-label="Đóng giỏ hàng">
      <i data-lucide="x"></i>
    </button>
  </div>

  <div class="cart-body" id="cartBody">
    <div class="cart-empty" id="cartEmpty">
      <div class="cart-empty-icon"><i data-lucide="shopping-bag"></i></div>
      <p>Giỏ hàng của bạn đang trống</p>
      <span>Hãy thêm dịch vụ bạn quan tâm!</span>
    </div>
    <div class="cart-items" id="cartItems"></div>
  </div>

  <div class="cart-footer" id="cartFooter" style="display:none">
    <div class="cart-summary">
      <div class="cart-summary-row">
        <span>Tạm tính (<span id="cartCount">0</span> dịch vụ)</span>
        <span id="cartSubtotal">0 ₫</span>
      </div>
      <div class="cart-summary-row cart-total-row">
        <strong>Tổng cộng</strong>
        <strong id="cartTotal" class="cart-total-price">0 ₫</strong>
      </div>
    </div>
    <button class="btn-checkout" id="checkoutBtn">
      <i data-lucide="credit-card"></i> Tiến hành thanh toán
    </button>
    <button class="btn-clear-cart" id="clearCartBtn">
      <i data-lucide="trash-2"></i> Xóa tất cả
    </button>
  </div>
</aside>

<div class="auth-modal" id="loginModal" role="dialog" aria-modal="true" aria-labelledby="loginTitle">
  <div class="auth-modal-inner">
    <button class="auth-modal-close" id="closeLogin" aria-label="Đóng"><i data-lucide="x"></i></button>

    <div class="auth-modal-logo">
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
        <circle cx="22" cy="22" r="22" fill="url(#authLogoGrad)"/>
        <path d="M11 22 L22 11 L33 22 L22 33 Z" fill="white" opacity="0.9"/>
        <circle cx="22" cy="22" r="6" fill="white"/>
        <defs>
          <linearGradient id="authLogoGrad" x1="0" y1="0" x2="44" y2="44">
            <stop offset="0%" stop-color="#0066CC"/>
            <stop offset="100%" stop-color="#00AAFF"/>
          </linearGradient>
        </defs>
      </svg>
      <span>VNVD</span>
    </div>

    <h2 id="loginTitle">Chào mừng trở lại!</h2>
    <p class="auth-subtitle">Đăng nhập để trải nghiệm dịch vụ số toàn diện</p>
    <div class="auth-demo-hint">
      <i data-lucide="info"></i>
      <span>Tài khoản Admin demo: <strong>admin@vnvd.vn</strong> / <strong>admin123</strong>. Đăng ký mới sẽ là tài khoản Khách hàng.</span>
    </div>

    <div class="auth-social-btns">
      <button class="btn-social btn-google" id="loginGoogle">
        <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/><path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/><path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/></svg>
        Tiếp tục với Google
      </button>
      <button class="btn-social btn-facebook" id="loginFacebook">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/></svg>
        Tiếp tục với Facebook
      </button>
    </div>

    <div class="auth-divider"><span>hoặc đăng nhập bằng email</span></div>

    <form class="auth-form" id="loginForm" novalidate>
      <div class="auth-field">
        <label for="loginEmail">Email</label>
        <div class="auth-input-wrap">
          <i data-lucide="mail"></i>
          <input type="email" id="loginEmail" placeholder="email@company.vn" autocomplete="email" required />
        </div>
        <span class="field-error" id="loginEmailErr"></span>
      </div>
      <div class="auth-field">
        <label for="loginPassword">Mật khẩu</label>
        <div class="auth-input-wrap">
          <i data-lucide="lock"></i>
          <input type="password" id="loginPassword" placeholder="Nhập mật khẩu" autocomplete="current-password" required />
          <button type="button" class="toggle-pw" data-target="loginPassword" aria-label="Hiện/ẩn mật khẩu">
            <i data-lucide="eye"></i>
          </button>
        </div>
        <span class="field-error" id="loginPasswordErr"></span>
      </div>
      <div class="auth-row">
        <label class="auth-checkbox">
          <input type="checkbox" id="rememberMe" /> Ghi nhớ đăng nhập
        </label>
        <a href="#" class="auth-link forgot-link" id="forgotLink">Quên mật khẩu?</a>
      </div>
      <div class="auth-error-box" id="loginError" style="display:none"></div>
      <button type="submit" class="btn-auth-submit" id="loginSubmit">
        <span>Đăng nhập</span>
        <i data-lucide="arrow-right"></i>
      </button>
    </form>

    <p class="auth-switch">Chưa có tài khoản? <button class="auth-link" id="switchToRegister">Đăng ký ngay</button></p>
  </div>
</div>

<div class="auth-modal" id="registerModal" role="dialog" aria-modal="true" aria-labelledby="registerTitle">
  <div class="auth-modal-inner">
    <button class="auth-modal-close" id="closeRegister" aria-label="Đóng"><i data-lucide="x"></i></button>

    <div class="auth-modal-logo">
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
        <circle cx="22" cy="22" r="22" fill="url(#authLogoGrad2)"/>
        <path d="M11 22 L22 11 L33 22 L22 33 Z" fill="white" opacity="0.9"/>
        <circle cx="22" cy="22" r="6" fill="white"/>
        <defs>
          <linearGradient id="authLogoGrad2" x1="0" y1="0" x2="44" y2="44">
            <stop offset="0%" stop-color="#0066CC"/>
            <stop offset="100%" stop-color="#00AAFF"/>
          </linearGradient>
        </defs>
      </svg>
      <span>VNVD</span>
    </div>

    <h2 id="registerTitle">Tạo tài khoản mới</h2>
    <p class="auth-subtitle">Đăng ký để bắt đầu hành trình chuyển đổi số</p>

    <form class="auth-form" id="registerForm" novalidate>
      <div class="auth-row-2">
        <div class="auth-field">
          <label for="regFirstName">Họ</label>
          <div class="auth-input-wrap">
            <i data-lucide="user"></i>
            <input type="text" id="regFirstName" placeholder="Nguyễn" required />
          </div>
          <span class="field-error" id="regFirstNameErr"></span>
        </div>
        <div class="auth-field">
          <label for="regLastName">Tên</label>
          <div class="auth-input-wrap">
            <i data-lucide="user"></i>
            <input type="text" id="regLastName" placeholder="Văn A" required />
          </div>
          <span class="field-error" id="regLastNameErr"></span>
        </div>
      </div>
      <div class="auth-field">
        <label for="regEmail">Email</label>
        <div class="auth-input-wrap">
          <i data-lucide="mail"></i>
          <input type="email" id="regEmail" placeholder="email@company.vn" autocomplete="email" required />
        </div>
        <span class="field-error" id="regEmailErr"></span>
      </div>
      <div class="auth-field">
        <label for="regPhone">Số điện thoại</label>
        <div class="auth-input-wrap">
          <i data-lucide="phone"></i>
          <input type="tel" id="regPhone" placeholder="0901 234 567" autocomplete="tel" />
        </div>
        <span class="field-error" id="regPhoneErr"></span>
      </div>
      <div class="auth-field">
        <label for="regPassword">Mật khẩu</label>
        <div class="auth-input-wrap">
          <i data-lucide="lock"></i>
          <input type="password" id="regPassword" placeholder="Tối thiểu 8 ký tự" autocomplete="new-password" required />
          <button type="button" class="toggle-pw" data-target="regPassword" aria-label="Hiện/ẩn mật khẩu">
            <i data-lucide="eye"></i>
          </button>
        </div>
        <div class="pw-strength" id="pwStrength">
          <div class="pw-strength-bar"><div class="pw-strength-fill" id="pwStrengthFill"></div></div>
          <span id="pwStrengthLabel">Độ mạnh mật khẩu</span>
        </div>
        <span class="field-error" id="regPasswordErr"></span>
      </div>
      <div class="auth-field">
        <label for="regConfirmPassword">Xác nhận mật khẩu</label>
        <div class="auth-input-wrap">
          <i data-lucide="lock"></i>
          <input type="password" id="regConfirmPassword" placeholder="Nhập lại mật khẩu" autocomplete="new-password" required />
          <button type="button" class="toggle-pw" data-target="regConfirmPassword" aria-label="Hiện/ẩn mật khẩu">
            <i data-lucide="eye"></i>
          </button>
        </div>
        <span class="field-error" id="regConfirmPasswordErr"></span>
      </div>
      <label class="auth-checkbox terms-check">
        <input type="checkbox" id="agreeTerms" required />
        Tôi đồng ý với <a href="#" class="auth-link">Điều khoản dịch vụ</a> và <a href="#" class="auth-link">Chính sách bảo mật</a>
      </label>
      <span class="field-error" id="agreeTermsErr"></span>
      <div class="auth-error-box" id="registerError" style="display:none"></div>
      <button type="submit" class="btn-auth-submit" id="registerSubmit">
        <span>Tạo tài khoản</span>
        <i data-lucide="user-plus"></i>
      </button>
    </form>

    <p class="auth-switch">Đã có tài khoản? <button class="auth-link" id="switchToLogin">Đăng nhập</button></p>
  </div>
</div>

<div class="admin-panel" id="adminPanel">
  <div class="admin-topbar">
    <div class="admin-topbar-left">
      <div class="admin-logo"><i data-lucide="layout-dashboard"></i></div>
      <div>
        <h2>Bảng điều khiển Quản trị</h2>
        <span>VNVD Admin • Chỉ dành cho quản trị viên</span>
      </div>
    </div>
    <button class="admin-close" id="adminClose"><i data-lucide="x"></i> Đóng</button>
  </div>

  <div class="admin-body">
    <div class="admin-stats">
      <div class="admin-stat"><div class="admin-stat-icon" style="--c:#0066CC"><i data-lucide="users"></i></div><div><div class="admin-stat-num" id="statUsers">0</div><div class="admin-stat-label">Người dùng</div></div></div>
      <div class="admin-stat"><div class="admin-stat-icon" style="--c:#00AA55"><i data-lucide="layers"></i></div><div><div class="admin-stat-num" id="statServices">8</div><div class="admin-stat-label">Dịch vụ đang bán</div></div></div>
      <div class="admin-stat"><div class="admin-stat-icon" style="--c:#FF6B00"><i data-lucide="shopping-bag"></i></div><div><div class="admin-stat-num" id="statOrders">0</div><div class="admin-stat-label">Đơn hàng</div></div></div>
      <div class="admin-stat"><div class="admin-stat-icon" style="--c:#8800CC"><i data-lucide="wallet"></i></div><div><div class="admin-stat-num" id="statRevenue">0 ₫</div><div class="admin-stat-label">Doanh thu (demo)</div></div></div>
    </div>

    <div class="admin-tabs">
      <button class="admin-tab active" data-tab="users"><i data-lucide="users"></i> Người dùng</button>
      <button class="admin-tab" data-tab="services"><i data-lucide="layers"></i> Dịch vụ</button>
      <button class="admin-tab" data-tab="orders"><i data-lucide="shopping-bag"></i> Đơn hàng</button>
    </div>

    <div class="admin-tab-panel active" data-panel="users">
      <div class="admin-card">
        <div class="admin-card-head"><h3>Danh sách người dùng</h3></div>
        <table class="admin-table">
          <thead><tr><th>Họ tên</th><th>Email</th><th>Số điện thoại</th><th>Vai trò</th></tr></thead>
          <tbody id="adminUsersBody"></tbody>
        </table>
      </div>
    </div>

    <div class="admin-tab-panel" data-panel="services">
      <div class="admin-card">
        <div class="admin-card-head"><h3>Dịch vụ & gói cước</h3></div>
        <table class="admin-table">
          <thead><tr><th>Mã</th><th>Tên dịch vụ</th><th>Giá / tháng</th><th>Trạng thái</th></tr></thead>
          <tbody id="adminServicesBody"></tbody>
        </table>
      </div>
    </div>

    <div class="admin-tab-panel" data-panel="orders">
      <div class="admin-card">
        <div class="admin-card-head"><h3>Đơn hàng từ giỏ hàng</h3></div>
        <table class="admin-table">
          <thead><tr><th>Mã đơn</th><th>Dịch vụ</th><th>Số lượng</th><th>Tổng tiền</th><th>Trạng trạng</th></tr></thead>
          <tbody id="adminOrdersBody"></tbody>
        </table>  
      </div>
    </div>
  </div>
</div>

<div class="toast" id="toast">
  <i data-lucide="check-circle"></i>
  <span id="toastMsg">Thao tác thành công!</span>
</div>

<script src="js/api.js"></script>
<script src="js/pages.js"></script>
<script src="js/main.js"></script>
<script src="js/chat.js"></script>
<script src="js/cart.js"></script>
<script src="js/auth.js"></script>
<script src="js/admin.js"></script>
<script src="js/carousel.js"></script>
</body>
</html>