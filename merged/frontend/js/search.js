document.addEventListener('DOMContentLoaded', function () {
    const searchToggleBtn = document.getElementById('searchToggleBtn');
    const liveSearchBox = document.getElementById('liveSearchBox');
    const liveSearchInput = document.getElementById('liveSearchInput');
    const liveSearchResults = document.getElementById('liveSearchResults');
    let searchTimeout;

    // --- TUYỆT CHIÊU 1: TỰ ĐỘNG CUỘN KHI TẢI LẠI TRANG ---
    // (Bắt buộc phải có để khi ép reload từ trang phụ về, nó tự trượt xuống)
    if (window.location.hash.startsWith('#dich-vu-')) {
        setTimeout(() => {
            const targetEl = document.querySelector(window.location.hash);
            if (targetEl) targetEl.scrollIntoView({behavior: 'smooth', block: 'center'});
        }, 500); // Đợi 0.5s cho giao diện trang chủ load xong
    }

    // Bật/tắt khung tìm kiếm
    if (searchToggleBtn) {
        searchToggleBtn.addEventListener('click', function (e) {
            e.preventDefault();
            const isHidden = liveSearchBox.style.display === 'none';
            liveSearchBox.style.display = isHidden ? 'block' : 'none';
            if (isHidden) liveSearchInput.focus();
        });
    }

    // Xử lý sự kiện gõ phím (Live Search)
    if (liveSearchInput) {
        liveSearchInput.addEventListener('input', function () {
            clearTimeout(searchTimeout);
            const query = this.value.trim();

            if (query.length < 2) {
                liveSearchResults.innerHTML = '<div style="padding: 15px; text-align: center; color: #888;">Gõ ít nhất 2 ký tự...</div>';
                return;
            }

            liveSearchResults.innerHTML = '<div style="padding: 15px; text-align: center; color: #0066CC;"><i data-lucide="loader" class="spin"></i> Đang tìm...</div>';
            if (window.lucide) lucide.createIcons();

            searchTimeout = setTimeout(() => {
                fetch(`../backend/api/search.php?q=${encodeURIComponent(query)}`)
                    .then(response => response.json())
                    .then(res => {
                        if (res.status === 'success') renderSearchResults(res.data);
                    })
                    .catch(err => {
                        liveSearchResults.innerHTML = '<div style="padding: 15px; text-align: center; color: red;">Có lỗi xảy ra!</div>';
                    });
            }, 300);
        });
    }

    function renderSearchResults(data) {
        if (data.length === 0) {
            liveSearchResults.innerHTML = '<div style="padding: 15px; text-align: center; color: #888;">Không tìm thấy kết quả nào phù hợp.</div>';
            return;
        }

        let html = '';
        data.forEach(item => {
            let icon = ''; let badge = ''; let bgColor = ''; let link = '#';

            if (item.type === 'san_pham') {
                icon = 'shopping-bag';
                badge = '<span style="background: #e6f2ff; color: #0066cc; padding: 2px 6px; border-radius: 4px; font-size: 11px; font-weight: bold; margin-left: 8px;">DỊCH VỤ</span>';
                bgColor = '#0066cc';
                link = `index.php#dich-vu-${item.id}`;
            } 
            else if (item.type === 'bai_viet') {
                icon = 'newspaper';
                badge = '<span style="background: #fff0e6; color: #e65c00; padding: 2px 6px; border-radius: 4px; font-size: 11px; font-weight: bold; margin-left: 8px;">TIN TỨC</span>';
                bgColor = '#e65c00';
                link = `bai-viet.php?slug=${item.id}`;
            } 
            else if (item.type === 'trang_tinh') {
                icon = 'info';
                badge = '<span style="background: #e6ffe6; color: #009933; padding: 2px 6px; border-radius: 4px; font-size: 11px; font-weight: bold; margin-left: 8px;">THÔNG TIN</span>';
                bgColor = '#009933';
                link = `#page=${item.id}`;
            }

            html += `
                <a href="${link}" data-type="${item.type}" data-id="${item.id}" style="display: flex; align-items: flex-start; padding: 12px 15px; border-bottom: 1px solid #f5f5f5; text-decoration: none; transition: background 0.2s;" class="search-result-item" onmouseover="this.style.background='#fafafa'" onmouseout="this.style.background='transparent'">
                    <div style="background: ${bgColor}15; color: ${bgColor}; width: 36px; height: 36px; border-radius: 6px; display: flex; align-items: center; justify-content: center; margin-right: 12px; flex-shrink: 0; margin-top: 2px;">
                        <i data-lucide="${icon}" style="width: 18px; height: 18px;"></i>
                    </div>
                    <div style="flex: 1; overflow: hidden;">
                        <div style="color: #333; font-weight: 600; font-size: 14px; margin-bottom: 4px; display: flex; align-items: center;">
                            <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 70%;">${item.title}</span>
                            ${badge}
                        </div>
                        <div style="color: #666; font-size: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                            ${item.description ? item.description : 'Không có mô tả...'}
                        </div>
                    </div>
                </a>
            `;
        });
        liveSearchResults.innerHTML = html;
        if(window.lucide) lucide.createIcons(); 
    }

    if (liveSearchResults) {
        liveSearchResults.addEventListener('click', function(e) {
            const item = e.target.closest('.search-result-item');
            if (!item) return;

            const type = item.getAttribute('data-type');
            const id = item.getAttribute('data-id');

            if (document.activeElement) document.activeElement.blur();
            liveSearchBox.style.display = 'none';

            if (type === 'san_pham') {
                e.preventDefault(); 
                const targetHash = '#dich-vu-' + id;
                
                // --- NHẬN DIỆN TRANG PHỤ CHUẨN XÁC NHẤT ---
                // Nếu URL có chứa chữ "page=" HOẶC đang ở file bai-viet/page.php thì đều tính là trang phụ
                const isSubPage = window.location.hash.includes('page=') || 
                                  window.location.pathname.includes('bai-viet.php') || 
                                  window.location.pathname.includes('page.php');
                
                if (isSubPage) {
                    // Trạng thái 1: Đang ở trang phụ -> Ép về trang chủ & tải lại trang
                    // Nhờ "Tuyệt chiêu 1" ở trên cùng, sau khi tải lại xong nó sẽ tự trượt xuống
                    window.location.href = 'index.php' + targetHash;
                    setTimeout(() => window.location.reload(), 100);
                } else {
                    // Trạng thái 2: Đang ở trang chủ gốc -> Đổi hash và trượt mượt mà (Không reload)
                    window.location.hash = targetHash; 
                    
                    let attempts = 0;
                    let checkExist = setInterval(() => {
                        const targetEl = document.getElementById('dich-vu-' + id);
                        if (targetEl && targetEl.offsetParent !== null) {
                            clearInterval(checkExist); 
                            targetEl.scrollIntoView({behavior: 'smooth', block: 'center'}); 
                        }
                        attempts++;
                        if (attempts > 15) clearInterval(checkExist); 
                    }, 100);
                }
            }
            else if (type === 'trang_tinh') {
                e.preventDefault();
                window.location.hash = 'page=' + id;
                setTimeout(() => window.location.reload(), 100);
            }
        });
    }

    document.addEventListener('click', function (e) {
        if (!e.target.closest('.search-wrapper')) liveSearchBox.style.display = 'none';
    });
});