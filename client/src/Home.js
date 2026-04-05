import React from "react";
import { useHistory } from "react-router-dom";

function HomePage() {
  const history = useHistory();

  const navigateTo = (path) => {
    history.push(path);
  };

  return (
    <div>
      <div className="card-modern">
        <h2 className="card-title">📌 Tổng quan hệ thống</h2>
        <p>
          Hệ thống này sử dụng công nghệ blockchain để theo dõi luồng hàng hóa xuyên suốt chuỗi cung ứng,
          từ nguyên liệu thô → sản xuất → phân phối → bán lẻ → tay người tiêu dùng.
          Dữ liệu được lưu trữ bất biến, minh bạch và chống giả mạo.
        </p>
      </div>

      <div className="row g-4">
        <div className="col-md-6">
          <div className="card-modern h-100">
            <h4 className="card-title">📝 Bước 1: Đăng ký thành viên</h4>
            <p>Chủ hợp đồng (Owner) cần đăng ký các bên tham gia: Nhà cung cấp nguyên liệu, Nhà sản xuất, Nhà phân phối, Nhà bán lẻ.</p>
            <button onClick={() => navigateTo("/roles")} className="btn btn-custom-primary">Đăng ký thành viên</button>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card-modern h-100">
            <h4 className="card-title">📦 Bước 2: Tạo đơn hàng</h4>
            <p>Sau khi có thành viên, chủ hợp đồng tạo sản phẩm mới trên blockchain (tên, mô tả).</p>
            <button onClick={() => navigateTo("/addmed")} className="btn btn-custom-primary">Tạo đơn hàng</button>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card-modern h-100">
            <h4 className="card-title">⚙️ Bước 3: Vận hành chuỗi cung ứng</h4>
            <p>Các bên cập nhật trạng thái hàng hóa qua từng giai đoạn (cung cấp, sản xuất, phân phối, bán lẻ, bán cho người dùng).</p>
            <button onClick={() => navigateTo("/supply")} className="btn btn-custom-primary">Quản lý vận hành</button>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card-modern h-100">
            <h4 className="card-title">🔍 Theo dõi sản phẩm</h4>
            <p>Người dùng có thể nhập mã sản phẩm để xem toàn bộ lịch sử lưu thông trên blockchain.</p>
            <button onClick={() => navigateTo("/track")} className="btn btn-custom-primary">Truy xuất nguồn gốc</button>
          </div>
        </div>
      </div>

      <div className="card-modern mt-4 text-center">
        <p className="mb-0">✅ <strong>Lưu ý:</strong> Mỗi giao dịch cần xác nhận qua MetaMask và phí gas. Đảm bảo bạn đã kết nối ví và chọn đúng mạng lưới.</p>
      </div>
    </div>
  );
}

export default HomePage;