import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './CartPage.css';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCartDetails();
  }, []);

  const fetchCartDetails = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError("Vui lòng đăng nhập.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get('http://dangtringhia1407-001-site1.otempurl.com/api/Carts/details', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data && response.data.CartItems) {
        setCartItems(response.data.CartItems.$values || []);
        setTotalAmount(response.data.TotalAmount || 0);
      } else {
        setCartItems([]);
        setTotalAmount(0);
      }
      setError(null);
    } catch (err) {
      setError("Không thể lấy dữ liệu giỏ hàng. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  // Hàm xóa một sản phẩm khỏi giỏ hàng
  const removeItem = async (productId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete('http://dangtringhia1407-001-site1.otempurl.com/api/Carts/remove-item', {
        headers: {
          Authorization: `Bearer ${token}`
        },
        data: { ProductId: productId }
      });
      // Sau khi xóa thành công, cập nhật lại giỏ hàng
      fetchCartDetails();
    } catch (err) {
      setError("Lỗi khi xóa sản phẩm khỏi giỏ hàng.");
    }
  };

  // Hàm xóa tất cả sản phẩm khỏi giỏ hàng
  const clearCart = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete('http://dangtringhia1407-001-site1.otempurl.com/api/Carts/clear', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      // Cập nhật lại giỏ hàng sau khi xóa tất cả sản phẩm
      setCartItems([]);
      setTotalAmount(0);
    } catch (err) {
      setError("Lỗi khi xóa tất cả sản phẩm khỏi giỏ hàng.");
    }
  };

  if (loading) return <p style={{marginTop: "100px"}}>Đang tải giỏ hàng...</p>;
  if (error) return <p>{error}</p>;
  if (cartItems.length === 0) return <p style={{marginTop: "100px"}}>Giỏ hàng của bạn đang trống.</p>;

  return (
    <div className="cart-container">
      <h2 className="cart-title">Giỏ Hàng</h2>
      <table className="cart-table">
        <thead>
          <tr>
            <th>Sản Phẩm</th>
            <th>Tên Sản Phẩm</th>
            <th>Số Lượng</th>
            <th>Giá</th>
            <th>Hành Động</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map((item, index) => (
            <tr key={index}>
              <td>
                <img src={item.ImageUrl} alt={item.ProductName} className="cart-item-image" />
              </td>
              <td className="product-name2">{item.ProductName}</td>
              <td className="quantity">{item.Quantity}</td>
              <td className="price">{item.UnitPrice.toLocaleString()} VND</td>
              <td>
                <button className="delete-button" onClick={() => removeItem(item.ProductId)}>
                 x
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="cart-total">Tổng thanh toán: {totalAmount.toLocaleString()} VND</div>
<div className="button-container">
<button className="delete-all-button" onClick={clearCart}>XÓA TẤT CẢ</button>
  <button className="checkout-button" onClick={() => navigate('/cart-preview')}>MUA HÀNG</button>
 
</div>

    </div>
  );
};

export default CartPage;
