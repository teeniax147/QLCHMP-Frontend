import axios from "axios";
import { API_BASE_URL } from "../config";
import { setCountItem } from "../redux/reducer/cartReducer";

// Trong file cart.service.js
export const getItemCount = async (dispatch) => {
  const token = localStorage.getItem("token");
  
  try {
    if (token) {
      // Người dùng đã đăng nhập - lấy số lượng từ API
      const response = await axios.get(`${API_BASE_URL}/Carts/count`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      dispatch({ type: 'SET_CART_COUNT', payload: response.data });
    } else {
      // Khách vãng lai - lấy số lượng từ localStorage
      const count = localStorage.getItem('guestCartCount') || '0';
      dispatch({ type: 'SET_CART_COUNT', payload: parseInt(count, 10) });
    }
  } catch (err) {
    console.error("Lỗi khi lấy số lượng giỏ hàng:", err);
  }
};