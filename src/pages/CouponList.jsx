import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './CouponList.css';

const CouponList = () => {
  const [coupons, setCoupons] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await axios.get('http://dangtringhia1407-001-site1.otempurl.com/api/Coupons');
        const couponsData = response.data.$values || [];
        setCoupons(couponsData);
      } catch (err) {
        setError("Không thể tải danh sách mã giảm giá.");
        console.error(err);
      }
    };

    fetchCoupons();
  }, []);

  return (
    <div className="coupon-list">
      <h1>DANH SÁCH MÃ GIẢM GIÁ</h1>
      {error && <p className="error">{error}</p>}
      <div className="coupon-grid">
        {coupons.map((coupon) => (
          <div className="coupon-card" key={coupon.Id || coupon.id}>
          <div className="coupon-left">
            <div className="logo4">GLAMOUR COSMIC</div>
            <h2 className="coupon-code">{coupon.Code}</h2>
          </div>
          <div className="coupon-right">
            <h2 className="coupon-discount">Giảm {coupon.DiscountPercentage}% Giảm tối đa {coupon.MaxDiscountAmount} VND</h2>
            <p className="min-order">Đơn tối thiểu: {coupon.MinimumOrderAmount} VND</p>
            <div className="expiry">
              <span>Ngày bắt đầu: {coupon.StartDate}</span>
              <span>Hiệu lực đến: {coupon.EndDate}</span>
            </div>
            <div className="quantity-tag">x {coupon.QuantityAvailable}</div>
          </div>
        </div>
        
            
          
        ))}
      </div>
    </div>
  );
};

export default CouponList;
