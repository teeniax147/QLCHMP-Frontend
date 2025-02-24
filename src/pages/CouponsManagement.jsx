import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import { API_BASE_URL } from '../config'
const CouponsManagement = () => {
  const [coupons, setCoupons] = useState([]); // Dữ liệu mã giảm giá
  const [loading, setLoading] = useState(true); // Trạng thái loading
  const [error, setError] = useState(null); // Lỗi nếu có

  // Hàm gọi API
  const fetchCoupons = async () => {
    try {
      setLoading(true); // Bắt đầu tải
      const response = await axios.get(`${API_BASE_URL}/Coupons`);
      console.log("Dữ liệu API trả về:", response.data); // Kiểm tra dữ liệu trả về
      const data = response.data.$values || []; // Lấy dữ liệu từ $values
      setCoupons(data); // Lưu dữ liệu vào state
    } catch (err) {
      console.error("Lỗi khi gọi API:", err); // Log lỗi chi tiết
      setError("Không thể tải danh sách mã giảm giá.");
    } finally {
      setLoading(false); // Kết thúc tải
    }
  };

  // Gọi API khi component được render
  useEffect(() => {
    fetchCoupons();
  }, []);

  // Hiển thị loading
  if (loading) return <CircularProgress style={{ display: "block", margin: "20px auto" }} />;

  // Hiển thị lỗi
  if (error) return <Alert severity="error" style={{ margin: "20px" }}>{error}</Alert>;

  // Hiển thị dữ liệu
  return (
    <div style={{ margin: "20px", marginTop: "40px", marginBottom: "20px" }}>
      <Typography variant="h4" align="center" gutterBottom>
        Danh Sách Mã Giảm Giá
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Tên mã</TableCell>
              <TableCell>Mã giảm giá</TableCell>
              <TableCell>Số tiền giảm</TableCell>
              <TableCell>% Giảm giá</TableCell>
              <TableCell>Giảm tối đa</TableCell>
              <TableCell>Ngày bắt đầu</TableCell>
              <TableCell>Ngày kết thúc</TableCell>
              <TableCell>Đơn hàng tối thiểu</TableCell>
              <TableCell>Số lượng còn lại</TableCell>
              <TableCell>Ngày tạo</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {coupons.map((coupon) => (
              <TableRow key={coupon.Id}>
                <TableCell>{coupon.Id}</TableCell>
                <TableCell>{coupon.Name}</TableCell>
                <TableCell>{coupon.Code}</TableCell>
                <TableCell>{coupon.DiscountAmount}</TableCell>
                <TableCell>{coupon.DiscountPercentage}</TableCell>
                <TableCell>{coupon.MaxDiscountAmount}</TableCell>
                <TableCell>{coupon.StartDate}</TableCell>
                <TableCell>{coupon.EndDate}</TableCell>
                <TableCell>{coupon.MinimumOrderAmount}</TableCell>
                <TableCell>{coupon.QuantityAvailable}</TableCell>
                <TableCell>{coupon.CreatedAt}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default CouponsManagement;
