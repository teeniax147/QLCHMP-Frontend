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
            Khách Vãng Lai vui lòng liên hệ số Zalo: 0937560278 hoặc email Buigiang2004thcsnd@gmail.com để xác nhận và cập nhật đơn hàng.
          </h3>
          <p className="guest-notice">
            Đơn hàng của bạn đã được ghi nhận. Chúng tôi sẽ liên hệ sớm nhất có thể để xác nhận đơn hàng.
          </p>
        </>
      ) : (
        // Hiển thị thông báo cho người dùng đã đăng nhập
        <h3 className="order-message">
          Cùng Glamour Cosmic bảo vệ quyền lợi của bạn - KHÔNG CHUYỂN TIỀN TRƯỚC cho Shipper khi đơn hàng chưa được giao tới với bất kỳ lý do gì
        </h3>
      )}

      <button onClick={() => navigate('/')} className="back-to-home-button">
        Quay lại Trang chủ
      </button>
    </div>
  );
};

export default OrderSuccessPage;