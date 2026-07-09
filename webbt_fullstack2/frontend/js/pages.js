/**
 * VNVD — Page Router Module (SPA) v4
 * Cung cấp các trang thông tin con mở ra khi click vào menu banner.
 * Nội dung tham khảo phong cách VNPT / dịch vụ số doanh nghiệp.
 */
(function () {
  'use strict';

  /* ============================================================
   * 1. DỮ LIỆU NỘI DUNG CÁC TRANG
   * ============================================================ */
  const PAGES = {
    /* ---------- VỀ CHÚNG TÔI ---------- */
    'gioi-thieu': {
      breadcrumb: ['Về chúng tôi', 'Giới thiệu'],

      body: `
        <div class="pg-section">
          <h2>Chúng tôi là ai?</h2>
          <p>VNVD là nhà cung cấp dịch vụ số hàng đầu Việt Nam với hơn <strong>30 năm kinh nghiệm</strong> trong lĩnh vực viễn thông và công nghệ thông tin. Chúng tôi cung cấp hệ sinh thái sản phẩm – dịch vụ số toàn diện: từ hạ tầng Cloud, mạng 5G, bảo mật, đến trí tuệ nhân tạo và các giải pháp quản trị doanh nghiệp.</p>
          <p>Với mạng lưới phủ sóng <strong>63 tỉnh thành</strong> và hơn <strong>500.000 khách hàng</strong> tin dùng, VNVD tự hào là đối tác chuyển đổi số tin cậy của doanh nghiệp, tổ chức và cơ quan nhà nước.</p>
        </div>
        <div class="pg-cards-3">
          <div class="pg-mini-card"><div class="pg-mini-icon" style="--c:#0066CC"><i data-lucide="calendar"></i></div><h4>1994</h4><p>Năm thành lập, khởi đầu hành trình công nghệ</p></div>
          <div class="pg-mini-card"><div class="pg-mini-icon" style="--c:#00AA55"><i data-lucide="users"></i></div><h4>15.000+</h4><p>Nhân sự chuyên môn cao trên toàn quốc</p></div>
          <div class="pg-mini-card"><div class="pg-mini-icon" style="--c:#FF6B00"><i data-lucide="globe"></i></div><h4>63/63</h4><p>Tỉnh thành có hạ tầng và điểm phục vụ</p></div>
        </div>
        <div class="pg-section">
          <h2>Lĩnh vực hoạt động</h2>
          <ul class="pg-list">
            <li><i data-lucide="check-circle"></i> Hạ tầng viễn thông & Cloud Computing</li>
            <li><i data-lucide="check-circle"></i> An toàn thông tin & Chứng thực số</li>
            <li><i data-lucide="check-circle"></i> Trí tuệ nhân tạo, Big Data & IoT</li>
            <li><i data-lucide="check-circle"></i> Chính phủ điện tử & Đô thị thông minh</li>
            <li><i data-lucide="check-circle"></i> Giải pháp chuyển đổi số cho doanh nghiệp</li>
          </ul>
        </div>`
    },
    'tam-nhin-su-menh': {
      breadcrumb: ['Về chúng tôi', 'Tầm nhìn & Sứ mệnh'],
      body: `
        <div class="pg-vm-grid">
          <div class="pg-vm-card">
            <div class="pg-vm-icon" style="--c:#0066CC"><i data-lucide="eye"></i></div>
            <h3>Tầm nhìn</h3>
            <p>Trở thành tập đoàn công nghệ số hàng đầu khu vực Đông Nam Á, dẫn dắt quá trình chuyển đổi số quốc gia và vươn tầm thế giới vào năm 2030.</p>
          </div>
          <div class="pg-vm-card">
            <div class="pg-vm-icon" style="--c:#00AA55"><i data-lucide="target"></i></div>
            <h3>Sứ mệnh</h3>
            <p>Mang công nghệ số đến mọi doanh nghiệp và người dân Việt Nam, thu hẹp khoảng cách số, tạo ra giá trị bền vững cho khách hàng, đối tác và cộng đồng.</p>
          </div>
        </div>
        <div class="pg-section">
          <h2>Giá trị cốt lõi</h2>
          <div class="pg-cards-3">
            <div class="pg-mini-card"><div class="pg-mini-icon" style="--c:#0066CC"><i data-lucide="heart-handshake"></i></div><h4>Khách hàng là trung tâm</h4><p>Mọi giải pháp đều xuất phát từ nhu cầu thực tế của khách hàng.</p></div>
            <div class="pg-mini-card"><div class="pg-mini-icon" style="--c:#FF6B00"><i data-lucide="lightbulb"></i></div><h4>Đổi mới sáng tạo</h4><p>Không ngừng nghiên cứu, ứng dụng công nghệ tiên tiến nhất.</p></div>
            <div class="pg-mini-card"><div class="pg-mini-icon" style="--c:#00AA55"><i data-lucide="shield-check"></i></div><h4>Chính trực & Tin cậy</h4><p>Cam kết chất lượng, bảo mật và trách nhiệm trong từng dịch vụ.</p></div>
          </div>
        </div>`
    },
    'doi-ngu-lanh-dao': {
      breadcrumb: ['Về chúng tôi', 'Đội ngũ lãnh đạo'],
      body: `
        <div class="pg-team-grid">
          <div class="pg-team-card"><div class="pg-team-avatar" style="background:linear-gradient(135deg,#0066CC,#00AAFF)">NV</div><h4>Nguyễn Văn Hùng</h4><span class="pg-team-role">Chủ tịch HĐQT</span><p>Hơn 25 năm kinh nghiệm lãnh đạo trong lĩnh vực viễn thông và công nghệ.</p></div>
          <div class="pg-team-card"><div class="pg-team-avatar" style="background:linear-gradient(135deg,#FF6B00,#FFB347)">TT</div><h4>Trần Thị Mai</h4><span class="pg-team-role">Tổng Giám đốc</span><p>Chuyên gia chiến lược chuyển đổi số, dẫn dắt tăng trưởng bền vững.</p></div>
          <div class="pg-team-card"><div class="pg-team-avatar" style="background:linear-gradient(135deg,#00AA55,#00FF88)">LP</div><h4>Lê Phú Quý</h4><span class="pg-team-role">Giám đốc Công nghệ (CTO)</span><p>Kiến trúc sư trưởng hệ thống Cloud & AI của tập đoàn.</p></div>
          <div class="pg-team-card"><div class="pg-team-avatar" style="background:linear-gradient(135deg,#8800CC,#C466FF)">PH</div><h4>Phạm Hoàng Anh</h4><span class="pg-team-role">Giám đốc Kinh doanh</span><p>Phát triển mạng lưới đối tác và khách hàng doanh nghiệp toàn quốc.</p></div>
        </div>`
    },
    'thanh-tuu': {
      breadcrumb: ['Về chúng tôi', 'Thành tựu'],
      body: `
        <div class="pg-cards-3">
          <div class="pg-mini-card"><div class="pg-mini-icon" style="--c:#FFB800"><i data-lucide="trophy"></i></div><h4>Top 10 ICT Việt Nam</h4><p>10 năm liên tiếp trong Top doanh nghiệp CNTT-TT hàng đầu.</p></div>
          <div class="pg-mini-card"><div class="pg-mini-icon" style="--c:#0066CC"><i data-lucide="badge-check"></i></div><h4>Chứng nhận ISO 27001</h4><p>Tiêu chuẩn quốc tế về quản lý an toàn thông tin.</p></div>
          <div class="pg-mini-card"><div class="pg-mini-icon" style="--c:#00AA55"><i data-lucide="star"></i></div><h4>Sao Khuê 2024</h4><p>Giải thưởng danh giá cho các sản phẩm phần mềm xuất sắc.</p></div>
        </div>
        <div class="pg-section">
          <h2>Các cột mốc nổi bật</h2>
          <div class="pg-timeline">
            <div class="pg-tl-item"><span class="pg-tl-year">2024</span><div class="pg-tl-content"><h4>500.000 khách hàng</h4><p>Cán mốc nửa triệu khách hàng doanh nghiệp tin dùng dịch vụ số.</p></div></div>
            <div class="pg-tl-item"><span class="pg-tl-year">2022</span><div class="pg-tl-content"><h4>Ra mắt nền tảng AI Cloud</h4><p>Nền tảng điện toán đám mây tích hợp trí tuệ nhân tạo đầu tiên.</p></div></div>
            <div class="pg-tl-item"><span class="pg-tl-year">2020</span><div class="pg-tl-content"><h4>Phủ sóng 5G</h4><p>Triển khai thử nghiệm mạng 5G tại các thành phố lớn.</p></div></div>
            <div class="pg-tl-item"><span class="pg-tl-year">1994</span><div class="pg-tl-content"><h4>Thành lập</h4><p>Khởi đầu hành trình kiến tạo giá trị số cho Việt Nam.</p></div></div>
          </div>
        </div>`
    },

    /* ---------- DỊCH VỤ ---------- */
    'ha-tang-so': {
      breadcrumb: ['Dịch vụ', 'Hạ tầng số'],
      body: `
        <div class="pg-section">
          <h2>Giải pháp hạ tầng toàn diện</h2>
          <p>Hệ thống trung tâm dữ liệu (Data Center) đạt chuẩn Tier III, kết nối băng thông rộng và hạ tầng viễn thông phủ sóng toàn quốc, đảm bảo dịch vụ vận hành liên tục 24/7 với SLA cam kết 99,9%.</p>
          <ul class="pg-list">
            <li><i data-lucide="check-circle"></i> Data Center chuẩn Tier III, an toàn cháy nổ & điện dự phòng</li>
            <li><i data-lucide="check-circle"></i> Đường truyền Internet Leased Line, MPLS, SD-WAN</li>
            <li><i data-lucide="check-circle"></i> Colocation & thuê chỗ đặt máy chủ chuyên nghiệp</li>
            <li><i data-lucide="check-circle"></i> Hạ tầng mạng cáp quang FTTx tốc độ cao</li>
          </ul>
        </div>`
    },
    'bao-mat-an-toan': {
      breadcrumb: ['Dịch vụ', 'Bảo mật & An toàn'],
      body: `
        <div class="pg-section">
          <h2>Dịch vụ an toàn thông tin</h2>
          <p>Hệ thống giám sát an ninh mạng (SOC) hoạt động 24/7, phát hiện và ngăn chặn tấn công theo thời gian thực, kết hợp các giải pháp chứng thực số để đảm bảo tuân thủ pháp luật.</p>
          <ul class="pg-list">
            <li><i data-lucide="check-circle"></i> Chứng thư số CA / SSL / SmartCA</li>
            <li><i data-lucide="check-circle"></i> Tường lửa ứng dụng web (WAF) & chống DDoS</li>
            <li><i data-lucide="check-circle"></i> eKYC – Định danh điện tử</li>
            <li><i data-lucide="check-circle"></i> Trung tâm điều hành an ninh mạng (SOC)</li>
          </ul>
        </div>`
    },
    'cloud-computing': {
      breadcrumb: ['Dịch vụ', 'Cloud Computing'],
      body: `
        <div class="pg-section">
          <h2>Điện toán đám mây thế hệ mới</h2>
          <p>Nền tảng Cloud của VNVD cho phép doanh nghiệp triển khai ứng dụng nhanh chóng, mở rộng tài nguyên theo nhu cầu và chỉ trả tiền cho những gì sử dụng, với hệ thống backup & disaster recovery tự động.</p>
          <ul class="pg-list">
            <li><i data-lucide="check-circle"></i> IaaS / PaaS / SaaS đầy đủ</li>
            <li><i data-lucide="check-circle"></i> Cloud Server, Cloud Storage, Cloud Database</li>
            <li><i data-lucide="check-circle"></i> Backup & Disaster Recovery tự động</li>
            <li><i data-lucide="check-circle"></i> Hybrid Cloud & Multi-Cloud</li>
          </ul>
        </div>`
    },
    'ai-tu-dong-hoa': {
      breadcrumb: ['Dịch vụ', 'AI & Tự động hóa'],
      body: `
        <div class="pg-section">
          <h2>Trí tuệ nhân tạo cho doanh nghiệp</h2>
          <p>Giải pháp AI toàn diện giúp tự động hóa quy trình, phân tích dữ liệu lớn và nâng cao trải nghiệm khách hàng, từ chatbot thông minh đến hệ thống nhận diện hình ảnh.</p>
          <ul class="pg-list">
            <li><i data-lucide="check-circle"></i> Smart Voice / Chatbot AI</li>
            <li><i data-lucide="check-circle"></i> AI Camera & Nhận diện khuôn mặt</li>
            <li><i data-lucide="check-circle"></i> Data Lakehouse & Analytics</li>
            <li><i data-lucide="check-circle"></i> RPA – Tự động hóa quy trình bằng robot</li>
          </ul>
        </div>`
    },

    /* ---------- GIẢI PHÁP ---------- */
    'gp-sme': {
      breadcrumb: ['Giải pháp', 'Doanh nghiệp vừa & nhỏ'],
      body: `
        <div class="pg-section">
          <h2>Chuyển đổi số cho SME</h2>
          <p>Gói giải pháp all-in-one giúp doanh nghiệp vừa và nhỏ số hóa toàn bộ hoạt động kinh doanh mà không cần đội ngũ IT chuyên trách: hóa đơn điện tử, chữ ký số, website, quản lý bán hàng.</p>
          <ul class="pg-list">
            <li><i data-lucide="check-circle"></i> Hóa đơn điện tử & Chữ ký số</li>
            <li><i data-lucide="check-circle"></i> Website & Email doanh nghiệp</li>
            <li><i data-lucide="check-circle"></i> Phần mềm quản lý bán hàng, kế toán</li>
            <li><i data-lucide="check-circle"></i> Marketing số & SMS Brandname</li>
          </ul>
        </div>`
    },
    'gp-enterprise': {
      breadcrumb: ['Giải pháp', 'Tập đoàn lớn'],
      body: `
        <div class="pg-section">
          <h2>Giải pháp Enterprise</h2>
          <p>Kiến trúc hệ thống được thiết kế riêng cho các tập đoàn với nhu cầu vận hành phức tạp, tích hợp ERP, quản trị nhân sự, chuỗi cung ứng và hệ thống báo cáo thông minh (BI).</p>
          <ul class="pg-list">
            <li><i data-lucide="check-circle"></i> ERP & Quản trị nguồn lực doanh nghiệp</li>
            <li><i data-lucide="check-circle"></i> Private Cloud & Hybrid Cloud tùy chỉnh</li>
            <li><i data-lucide="check-circle"></i> Business Intelligence & Big Data</li>
            <li><i data-lucide="check-circle"></i> Tư vấn & triển khai chuyển đổi số toàn diện</li>
          </ul>
        </div>`
    },
    'gp-chinh-phu': {
      breadcrumb: ['Giải pháp', 'Chính phủ số'],
      body: `
        <div class="pg-section">
          <h2>Chính phủ điện tử & Đô thị thông minh</h2>
          <p>Đồng hành cùng các cơ quan nhà nước xây dựng nền tảng chính quyền số, cung cấp dịch vụ công trực tuyến mức độ 4 và hạ tầng đô thị thông minh (Smart City).</p>
          <ul class="pg-list">
            <li><i data-lucide="check-circle"></i> Cổng dịch vụ công trực tuyến</li>
            <li><i data-lucide="check-circle"></i> Nền tảng đô thị thông minh (Smart City)</li>
            <li><i data-lucide="check-circle"></i> Hệ thống một cửa điện tử</li>
            <li><i data-lucide="check-circle"></i> Trục liên thông văn bản điện tử</li>
          </ul>
        </div>`
    },
    'gp-yte-giaoduc': {
      breadcrumb: ['Giải pháp', 'Y tế & Giáo dục'],
      body: `
        <div class="pg-section">
          <h2>Chuyển đổi số Y tế & Giáo dục</h2>
          <p>Giải pháp chuyên biệt cho ngành y tế (bệnh án điện tử, khám chữa bệnh từ xa) và giáo dục (học trực tuyến, quản lý trường học), góp phần nâng cao chất lượng phục vụ người dân.</p>
          <ul class="pg-list">
            <li><i data-lucide="check-circle"></i> Bệnh án điện tử & Y tế từ xa (Telehealth)</li>
            <li><i data-lucide="check-circle"></i> Nền tảng học trực tuyến (E-Learning / LMS)</li>
            <li><i data-lucide="check-circle"></i> Quản lý trường học & Sổ liên lạc điện tử</li>
            <li><i data-lucide="check-circle"></i> Thanh toán học phí & viện phí không tiền mặt</li>
          </ul>
        </div>`
    },

    /* ---------- HỆ SINH THÁI ---------- */
    'he-sinh-thai': {
      breadcrumb: ['Hệ sinh thái'],
      body: `
        <div class="pg-section">
          <h2>Kết nối toàn diện</h2>
          <p>Hệ sinh thái VNVD tích hợp hàng trăm sản phẩm và dịch vụ số, cho phép doanh nghiệp lựa chọn và kết hợp linh hoạt theo nhu cầu, tất cả trên một nền tảng quản lý thống nhất.</p>
        </div>
        <div class="pg-cards-3">
          <div class="pg-mini-card"><div class="pg-mini-icon" style="--c:#0066CC"><i data-lucide="cloud"></i></div><h4>Cloud & Hạ tầng</h4><p>Data Center, Cloud Server, mạng 5G, IoT.</p></div>
          <div class="pg-mini-card"><div class="pg-mini-icon" style="--c:#FF6B00"><i data-lucide="shield"></i></div><h4>An toàn số</h4><p>Chứng thực số, bảo mật, định danh điện tử.</p></div>
          <div class="pg-mini-card"><div class="pg-mini-icon" style="--c:#00AA55"><i data-lucide="briefcase"></i></div><h4>Quản trị DN</h4><p>Hóa đơn, hợp đồng, văn phòng điện tử.</p></div>
          <div class="pg-mini-card"><div class="pg-mini-icon" style="--c:#8800CC"><i data-lucide="cpu"></i></div><h4>AI & Dữ liệu</h4><p>Chatbot, phân tích dữ liệu, tự động hóa.</p></div>
          <div class="pg-mini-card"><div class="pg-mini-icon" style="--c:#0099AA"><i data-lucide="video"></i></div><h4>Cộng tác</h4><p>Họp trực tuyến, email, lưu trữ chia sẻ.</p></div>
          <div class="pg-mini-card"><div class="pg-mini-icon" style="--c:#CC3300"><i data-lucide="credit-card"></i></div><h4>Tài chính số</h4><p>Thanh toán, ví điện tử, hóa đơn số.</p></div>
        </div>`
    },

    /* ---------- TIN TỨC ---------- */
    'thong-cao-bao-chi': {
      breadcrumb: ['Tin tức', 'Thông cáo báo chí'],
      body: `
        <div class="pg-news-list">
          <article class="pg-news-item"><span class="pg-news-date">28/06/2026</span><h3>VNVD cán mốc 500.000 khách hàng doanh nghiệp</h3><p>Tập đoàn chính thức công bố đạt nửa triệu khách hàng doanh nghiệp sử dụng dịch vụ số trên toàn quốc.</p></article>
          <article class="pg-news-item"><span class="pg-news-date">15/06/2026</span><h3>Ra mắt nền tảng AI Cloud thế hệ mới</h3><p>Nền tảng điện toán đám mây tích hợp AI giúp doanh nghiệp tối ưu chi phí đến 40%.</p></article>
          <article class="pg-news-item"><span class="pg-news-date">02/06/2026</span><h3>VNVD nhận giải Sao Khuê 2026</h3><p>Bộ giải pháp chuyển đổi số cho SME được vinh danh tại giải thưởng công nghệ danh giá.</p></article>
        </div>`
    },
    'blog-cong-nghe': {
      breadcrumb: ['Tin tức', 'Blog công nghệ'],
      body: `
        <div class="pg-news-list">
          <article class="pg-news-item"><span class="pg-news-date">Xu hướng</span><h3>5 xu hướng chuyển đổi số doanh nghiệp năm 2026</h3><p>Từ AI tạo sinh đến điện toán biên (Edge Computing) — những công nghệ định hình tương lai.</p></article>
          <article class="pg-news-item"><span class="pg-news-date">Bảo mật</span><h3>Vì sao doanh nghiệp cần Zero Trust Security?</h3><p>Mô hình bảo mật "không tin tưởng mặc định" đang trở thành tiêu chuẩn mới.</p></article>
          <article class="pg-news-item"><span class="pg-news-date">Cloud</span><h3>Hybrid Cloud: Lựa chọn tối ưu cho doanh nghiệp Việt</h3><p>Kết hợp linh hoạt giữa public và private cloud để cân bằng chi phí và bảo mật.</p></article>
        </div>`
    },
    'su-kien': {
      breadcrumb: ['Tin tức', 'Sự kiện'],
      body: `
        <div class="pg-news-list">
          <article class="pg-news-item"><span class="pg-news-date">20/07/2026</span><h3>Hội thảo "Chuyển đổi số ngành bán lẻ"</h3><p>Sự kiện trực tuyến chia sẻ giải pháp số cho doanh nghiệp bán lẻ. Đăng ký tham dự miễn phí.</p></article>
          <article class="pg-news-item"><span class="pg-news-date">05/08/2026</span><h3>VNVD Tech Day 2026</h3><p>Ngày hội công nghệ thường niên với các demo sản phẩm mới nhất và workshop chuyên sâu.</p></article>
          <article class="pg-news-item"><span class="pg-news-date">18/08/2026</span><h3>Webinar: An toàn thông tin cho SME</h3><p>Chuyên gia bảo mật hướng dẫn cách bảo vệ dữ liệu cho doanh nghiệp nhỏ.</p></article>
        </div>`
    },

    /* ---------- ĐỐI TÁC ---------- */
    'doi-tac': {
      breadcrumb: ['Đối tác'],
      body: `
        <div class="pg-section">
          <h2>Mạng lưới đối tác chiến lược</h2>
          <p>VNVD hợp tác với các tập đoàn công nghệ toàn cầu để mang đến cho khách hàng những giải pháp tốt nhất, cập nhật công nghệ mới nhất và tiêu chuẩn quốc tế.</p>
        </div>
        <div class="pg-partners-grid">
          <div class="pg-partner">Microsoft</div>
          <div class="pg-partner">Amazon AWS</div>
          <div class="pg-partner">Google Cloud</div>
          <div class="pg-partner">Cisco</div>
          <div class="pg-partner">Oracle</div>
          <div class="pg-partner">IBM</div>
          <div class="pg-partner">Huawei</div>
          <div class="pg-partner">Fortinet</div>
        </div>
        <div class="pg-section" style="text-align:center;margin-top:2rem">
          <h2>Trở thành đối tác của VNVD</h2>
          <p>Chúng tôi luôn tìm kiếm những đối tác cùng chí hướng để mở rộng hệ sinh thái số.</p>
          <button class="btn-primary pg-goto-contact"><i data-lucide="mail"></i> Liên hệ hợp tác</button>
        </div>`
    }
  };

  /* ============================================================
   * 2. ROUTER LOGIC
   * ============================================================ */
  let pageContainer = null;

  function ensureContainer() {
    if (pageContainer) return pageContainer;
    pageContainer = document.createElement('div');
    pageContainer.id = 'pageView';
    pageContainer.className = 'page-view';
    document.body.appendChild(pageContainer);
    return pageContainer;
  }

  // Sửa lại hàm này
  function renderPage(page) {
    // Không cần dùng PAGES[key] nữa, vì 'page' chính là dữ liệu nhận từ API
    if (!page) return false;
    const c = ensureContainer();

    // Lưu ý: Đảm bảo breadcrumb từ database trả về là một mảng (Array)
    const crumbs = page.breadcrumb.map((b, i) =>
      i === page.breadcrumb.length - 1
        ? `<span class="pg-crumb-current">${b}</span>`
        : `<span>${b}</span><i data-lucide="chevron-right" class="pg-crumb-sep"></i>`
    ).join('');

    c.innerHTML = `
      <div class="pg-hero">
        <div class="pg-hero-orbs"><span></span><span></span></div>
        <div class="container">
          <button class="pg-back" id="pgBack"><i data-lucide="arrow-left"></i> Về trang chủ</button>
          <div class="pg-breadcrumb"><a href="#home" data-page="home">Trang chủ</a><i data-lucide="chevron-right" class="pg-crumb-sep"></i>${crumbs}</div>
          <div class="pg-hero-title-row">
            <div class="pg-hero-icon"><i data-lucide="${page.icon}"></i></div>
            <div>
              <h1>${page.title}</h1>
              <p>${page.subtitle}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="pg-content container">
        ${page.body}
        <div class="pg-cta-box">
          <div>
            <h3>Cần tư vấn thêm? Hãy để VNVD đồng hành cùng bạn</h3>
            <p>Đội ngũ chuyên gia của VNVD sẵn sàng hỗ trợ doanh nghiệp bạn 24/7.</p>
          </div>
          <button class="btn-primary pg-goto-contact"><i data-lucide="phone"></i> Liên hệ ngay</button>
        </div>
      </div>`;

    // Show page view
    document.body.classList.add('page-open');
    c.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'auto' });
    if (window.lucide) lucide.createIcons();

    // Wire buttons
    c.querySelector('#pgBack')?.addEventListener('click', goHome);
    c.querySelectorAll('.pg-goto-contact').forEach(b =>
      b.addEventListener('click', () => { goHome(); setTimeout(() => scrollToContact(), 250); })
    );
    c.querySelector('.pg-breadcrumb a[data-page="home"]')?.addEventListener('click', (e) => { e.preventDefault(); goHome(); });
    return true;
  }

  function scrollToContact() {
    const t = document.getElementById('contact');
    if (t) {
      const top = t.getBoundingClientRect().top + window.scrollY - 110;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }

  function goHome() {
    document.body.classList.remove('page-open');
    if (pageContainer) pageContainer.classList.remove('active');
    history.replaceState(null, '', '#home');
  }

 async function navigateTo(key) {
    if (key === 'home') { goHome(); return; }
    if (key === 'contact') { goHome(); setTimeout(scrollToContact, 200); return; }

    try {
        // Đã sửa đường dẫn gọi API trỏ về thư mục backend
        const response = await fetch(`../backend/api/pages.php?slug=${key}`);
        const responseData = await response.json();

        if (responseData.status === 'success') {
            // Lấy dữ liệu tĩnh cũ
            const pageInfo = PAGES[key]; 
            
            // Trộn dữ liệu mới từ Database vào
            const updatedPage = {
                ...pageInfo, // Giữ lại body, icon, breadcrumb cũ
                title: responseData.data.title,       // Ghi đè bằng title mới
                subtitle: responseData.data.subtitle,  // Ghi đè bằng subtitle mới
                icon: responseData.data.icon || pageInfo.icon, // Ghi đè icon nếu có, nếu không giữ lại icon cũ
            };

            renderPage(updatedPage);
            history.replaceState(null, '', '#page=' + key);
        }
    } catch (err) {
        console.error('Lỗi kết nối:', err);
    }
}

  // Expose globally so cart/checkout & other modules can use
  window.VNVDRouter = { navigateTo, goHome };

  /* ============================================================
   * 3. GẮN SỰ KIỆN CLICK CHO MENU BANNER
   * ============================================================ */
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-page]').forEach(el => {
      // skip the internal home breadcrumb link (wired above)
      if (el.closest('#pageView')) return;
      el.addEventListener('click', (e) => {
        const key = el.getAttribute('data-page');
        if (!key) return;
        e.preventDefault();
        navigateTo(key);
      });
    });

    // Support deep-link on load (#page=key)
    const m = location.hash.match(/#page=([\w-]+)/);
    if (m) navigateTo(m[1]);
  });

})();