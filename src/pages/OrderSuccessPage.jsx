import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './OrderSuccessPage.css';

const OrderSuccessPage = () => {
  const navigate = useNavigate();
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    // Kiểm tra nếu là khách vãng lai (không có token)
    const token = localStorage.getItem('token');
    setIsGuest(!token);
  }, []);

  return (
    <div className="order-success-container">
      <h2 className="order-success-message">ĐẶT HÀNG THÀNH CÔNG</h2>

      {isGuest ? (
        // Hiển thị thông báo cho khách vãng lai
        <>
          <h3 className="order-message">
            Số điện thoại shop: 0942781516 và Gmail: nguyenutphuongthuy1111@gmail.com. Khách hàng liên hệ qua thông tin trên để xác nhận và cập nhật đơn hàng nhé
          </h3>
          <p className="guest-notice">
            Đơn hàng của bạn đã được ghi nhận. Chúng tôi sẽ liên hệ sớm nhất có thể để xác nhận đơn hàng.
          </p>
        </>
      ) : (
        // Hiển thị thông báo cho người dùng đã đăng nhập
        <h3 className="order-message">
            Bubble không yêu cầu chuyển khoản trước đối với giao dịch "Thanh Toán Khi Nhận Hàng". Vui lòng cẩn thận với những yêu cầu "Chuyển Khoản" cho Shipper.
        </h3>
      )}

      <button onClick={() => navigate('/')} className="back-to-home-button">
        Quay lại Trang chủ
      </button>
    </div>
  );
};

export default OrderSuccessPage;