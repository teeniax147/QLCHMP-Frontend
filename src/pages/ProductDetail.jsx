import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./ProductDetail.css";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProductDetail = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://dangtringhia1407-001-site1.otempurl.com/api/Products/chi-tiet/${id}`);
        setProduct(response.data);
      } catch (err) {
        console.error("Lỗi khi tải chi tiết sản phẩm:", err);
        setError("Không thể tải chi tiết sản phẩm.");
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetail();
  }, [id]);
  const handleAddToFavorites = async (productId) => {
    const token = localStorage.getItem("token"); // Lấy token từ localStorage
    console.log("Token từ localStorage:", token);

    if (!token) {
      alert("Bạn cần đăng nhập để thêm sản phẩm vào danh sách yêu thích.");
      return;
    }

    try {
      const response = await axios.post(
        "http://dangtringhia1407-001-site1.otempurl.com/api/Favorites/add",
        { ProductId: productId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(response.data); // Hiển thị thông báo thành công từ server
    } catch (error) {
      console.error("Lỗi khi thêm sản phẩm yêu thích:", error.response?.data || error.message);
      alert(error.response?.data || "Không thể thêm sản phẩm vào yêu thích.");
    }
  };
  const handleAddToCart = async (redirectToCart = false) => {
    try {
      const token = localStorage.getItem('token');
      console.log("Token hiện tại:", token); // Kiểm tra token

      if (!token) {
        alert("Vui lòng đăng nhập trước khi thêm vào giỏ hàng.");
        navigate('/login');
        return;
      }

      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      const requestData = {
        ProductId: parseInt(id, 10),
        Quantity: quantity
      };
      console.log("Dữ liệu gửi đi:", requestData);

      const response = await axios.post(
        'http://dangtringhia1407-001-site1.otempurl.com/api/Carts/add',
        requestData,
        config
      );

      alert(response.data);

      // Điều hướng đến giỏ hàng nếu người dùng chọn "Mua Ngay"
      if (redirectToCart) {
        navigate('/CartPage');
      }

    } catch (err) {
      console.error("Chi tiết lỗi:", err);
      if (err.response) {
        console.error("Lỗi API:", err.response);
        alert(`Lỗi từ server: ${err.response.data?.message || 'Không thể xử lý yêu cầu'}`);
      } else if (err.request) {
        console.error("Không có phản hồi từ server:", err.request);
        alert("Không có phản hồi từ server. Vui lòng kiểm tra kết nối.");
      } else {
        console.error("Lỗi khi thực hiện yêu cầu:", err.message);
        alert(`Lỗi: ${err.message}`);
      }
    }
  };

  const handleQuantityChange = (change) => {
    setQuantity((prev) => Math.max(1, prev + change));
  };

  if (loading) return <p>Đang tải chi tiết sản phẩm...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="product-detail-container">
      <img
        src={product?.ImageUrl || "https://via.placeholder.com/500"}
        alt={product?.Name}
        className="product-detail-image"
      />
      <div className="product-details">
        <h1 className="custom-product-title">{product?.Name}</h1>

        <p className="custom-product-price"> {product?.Price?.toLocaleString()} VND</p>

        <div className="product-actions">
          <div className="quantity-container">
            <button onClick={() => handleQuantityChange(-1)}>-</button>
            <div className="quantity-display">{quantity}</div>
            <button onClick={() => handleQuantityChange(1)}>+</button>
          </div>

          <div className="buttons-container">
            <button className="custom-add-to-cart-button" onClick={() => handleAddToCart(false)}>
              <img
                src="https://img.icons8.com/?size=100&id=ii6Lr4KivOiE&format=png&color=000000"
                alt="Cart Icon"
                style={{
                  width: "20px",
                  height: "20px",
                  marginRight: "8px",
                  verticalAlign: "middle",
                  filter: "invert(1)",
                }}
              />
              Thêm vào giỏ hàng
            </button>

            <button className="custom-buy-now-button" onClick={() => handleAddToCart(true)}>
              <span>Mua Ngay</span>
            </button>

            {/* Nút yêu thích */}
            <div
              className="product-favorite-icon1"
              onClick={(e) => {
                e.stopPropagation(); // Ngăn sự kiện click vào thẻ cha
                handleAddToFavorites(product.Id); // Gọi API thêm vào danh sách yêu thích
              }}
            >
              ♡
            </div>
          </div>



        </div>
        <p className="introduce">Giới thiệu:</p>

        <p className="custom-product-description">{product?.Description}</p>

      </div>
    </div>

  );
};

export default ProductDetail;
