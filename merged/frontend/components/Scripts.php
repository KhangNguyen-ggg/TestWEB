<!-- ==========================================
     QUẢN LÝ JAVASCRIPT TOÀN CỤC
     ========================================== -->

<!-- 1. Cấu hình hệ thống & API (Nạp đầu tiên vì các file khác cần dùng) -->
<script src="js/api.js"></script>
<script src="js/pages.js"></script>

<!-- 2. Thư viện bên ngoài (Nạp trước các file logic cốt lõi) -->
<!-- Google Identity Services -->
<script src="https://accounts.google.com/gsi/client" async defer></script>
<script>
  window.fbAsyncInit = function() {
    FB.init({
      appId      : '1043538668533467', 
      cookie     : true,
      xfbml      : true,
      version    : 'v19.0'
    });
    console.log("Facebook SDK đã khởi tạo xong!");
  };
</script>
<!-- Facebook SDK -->
<script async defer crossorigin="anonymous" src="https://connect.facebook.net/vi_VN/sdk.js"></script>

<!-- 3. Logic tính năng cốt lõi (Module-based) -->
<script src="js/auth.js"></script>  <!-- Quản lý trạng thái Đăng nhập/Đăng ký -->
<script src="js/cart.js"></script>  <!-- Xử lý Giỏ hàng -->
<!-- <script src="js/admin.js"></script> Bảng điều khiển Admin -->
<script src="js/chat.js"></script>  <!-- Bot tư vấn -->

<!-- 4. Hiệu ứng UI & Main Script (Nạp sau cùng để đảm bảo HTML đã vẽ xong) -->
<script src="js/carousel.js"></script>
<script src="js/main.js"></script>

<!-- NẾU CÓ THƯ VIỆN NGOÀI (VD: SweetAlert, Axios) THÌ BẠN CŨNG NHÉT VÀO ĐÂY -->
<!-- <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script> -->