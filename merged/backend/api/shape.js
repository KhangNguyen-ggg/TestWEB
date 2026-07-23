/**
 * src/shape.js
 * Chuyển đổi giữa bản ghi DB và "user object" mà frontend đang dùng
 * ({ id, firstName, lastName, email, phone, role }), cùng metadata
 * hiển thị (icon/color) cho sản phẩm để khớp giao diện cũ.
 */

// ho_ten (1 chuỗi) -> { firstName, lastName }
// Quy ước: từ đầu tiên là "họ" (firstName ở frontend), phần còn lại là "tên".
function splitName(hoTen) {
  const parts = String(hoTen || '').trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { firstName: '', lastName: '' };
  if (parts.length === 1) return { firstName: parts[0], lastName: '' };
  return { firstName: parts[0], lastName: parts.slice(1).join(' ') };
}
function joinName(firstName, lastName) {
  return `${String(firstName || '').trim()} ${String(lastName || '').trim()}`.trim();
}

// khach_hang row -> user object
function shapeCustomer(row) {
  const { firstName, lastName } = splitName(row.ho_ten);
  return {
    id: row.id,
    firstName,
    lastName,
    email: row.email || '',
    phone: row.so_dien_thoai || '',
    role: 'customer',
  };
}

// nhan_vien row -> user object (admin)
function shapeAdmin(row) {
  const { firstName, lastName } = splitName(row.ho_ten);
  return {
    id: row.id,
    firstName,
    lastName,
    email: row.email || '',
    phone: row.phone || '',
    role: 'admin',
  };
}

// Metadata trình bày (icon lucide + màu) cho từng sản phẩm theo ma_san_pham.
// Giữ đúng icon/color mà frontend đang render trên thẻ dịch vụ / giỏ hàng.
const PRODUCT_META = {
  'svc-001': { icon: 'cloud',        color: '#0066CC' },
  'svc-002': { icon: 'shield-check', color: '#FF6B00' },
  'svc-003': { icon: 'cpu',          color: '#00AA55' },
  'svc-004': { icon: 'wifi',         color: '#8800CC' },
  'svc-005': { icon: 'file-text',    color: '#CC3300' },
  'svc-006': { icon: 'video',        color: '#0099AA' },
  'svc-007': { icon: 'database',     color: '#0066CC' },
  'svc-008': { icon: 'radio',        color: '#00AA55' },
  'pkg-basic':    { icon: 'package',   color: '#0099AA' },
  'pkg-business': { icon: 'briefcase', color: '#0066CC' },
  'pkg-premium':  { icon: 'crown',     color: '#FF6B00' },
};

function shapeProduct(row) {
  const meta = PRODUCT_META[row.ma_san_pham] || { icon: 'box', color: '#0066CC' };
  const price = row.gia_khuyen_mai != null ? Number(row.gia_khuyen_mai) : Number(row.gia_niem_yet);
  return {
    // "id" = mã sản phẩm để khớp data-id của frontend
    id: row.ma_san_pham,
    dbId: row.id,
    name: row.ten_san_pham,
    price,
    listPrice: Number(row.gia_niem_yet),
    unit: row.don_vi_tinh || 'tháng',
    slug: row.slug,
    category: row.danh_muc_id,
    type: row.loai_san_pham,
    desc: row.mo_ta_ngan || '',
    status: row.trang_thai,
    icon: meta.icon,
    color: meta.color,
  };
}

module.exports = { splitName, joinName, shapeCustomer, shapeAdmin, shapeProduct, PRODUCT_META };
