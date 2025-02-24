import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  styled,
  Modal,
  Box,
  TextField,
  Typography,
} from "@mui/material";
import { API_BASE_URL } from '../config'
// Styled Components
const StyledTableCell = styled(TableCell)({
  textAlign: "center",
  fontWeight: "bold",
  fontSize: "16px",
});

const StyledButton = styled(Button)(({ color }) => ({
  color: color,
  borderColor: color,
  margin: "0 5px",
  "&:hover": {
    borderColor: color,
    backgroundColor: "transparent",
  },
  "&:focus": {
    outline: "none",
  },
}));

const AddButton = styled(Button)({
  backgroundColor: "blue",
  color: "white",
  "&:hover": {
    backgroundColor: "#0056b3",
  },
  "&:focus": {
    outline: "none",
  },
});

// Modal Style
const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const ProductManager = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  console.log("File đã chọn:", selectedFile);
  // State thêm để lưu file ảnh
  const [currentProduct, setCurrentProduct] = useState({
    Name: "",
    Price: "",
    OriginalPrice: "",
    Description: "",
    ImageUrl: "",
  });
  const pageSize = 10;

  // Lấy danh sách sản phẩm
  const fetchProducts = async (page) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${API_BASE_URL}/Products/danh-sach`,
        { params: { pageNumber: page, pageSize: pageSize } }
      );
      setProducts(response.data?.DanhSachSanPham?.$values || []);
      setTotalProducts(response.data?.TongSoSanPham || 0);
      setCurrentPage(page);
    } catch (error) {
      setError("Không thể tải danh sách sản phẩm. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

  // Hàm mở modal
  const openModal = (type, product = null) => {
    setModalType(type);
    setCurrentProduct(
      product || {
        Name: "",
        Price: "",
        OriginalPrice: "",
        Description: "",
        ImageUrl: "",
      }
    );
    // Reset file khi mở modal
    setModalVisible(true);
  };

  const handleAddProduct = async () => {
    const formData = new FormData();
    formData.append("Name", currentProduct.Name);
    formData.append("Price", currentProduct.Price);
    formData.append("OriginalPrice", currentProduct.OriginalPrice);
    formData.append("Description", currentProduct.Description);

    // Thêm ID thương hiệu (giả sử bạn đang dùng một giá trị tạm thời)
    formData.append("BrandIds", [1]); // Thay giá trị 1 bằng ID thương hiệu bạn muốn gửi



    // Log kiểm tra dữ liệu trong FormData
    console.log("Dữ liệu FormData gửi đi:");
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_BASE_URL}/Products/them-moi`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Phản hồi từ API:", response.data);
      fetchProducts(currentPage);
      alert("Thêm sản phẩm thành công!");
    } catch (error) {
      console.error("Lỗi từ API:", error.response?.data || error.message);
      alert(
        `Lỗi khi thêm sản phẩm: ${error.response?.data?.message || "Kiểm tra log chi tiết trên console"
        }`
      );
    } finally {
      setModalVisible(false);
    }
  };




  // Hàm xử lý cập nhật sản phẩm
  const handleEditProduct = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${API_BASE_URL}/Products/cap-nhat/${currentProduct.Id}`,
        currentProduct,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchProducts(currentPage);
      alert("Cập nhật sản phẩm thành công!");
    } catch (error) {
      alert("Lỗi khi cập nhật sản phẩm.");
    } finally {
      setModalVisible(false);
    }
  };

  // Hàm xử lý xóa sản phẩm
  const handleDeleteProduct = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${API_BASE_URL}/Products/xoa/${currentProduct.Id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchProducts(currentPage);
      alert("Xóa sản phẩm thành công!");
    } catch (error) {
      alert("Lỗi khi xóa sản phẩm.");
    } finally {
      setModalVisible(false);
    }
  };

  // Tổng số trang
  const totalPages = Math.ceil(totalProducts / pageSize);

  return (
    <div style={{ padding: "5px 0 0", marginTop: "40px", marginBottom: "20px" }}>
      <Typography variant="h4" align="center" gutterBottom>
        Danh Mục Sản Phẩm
      </Typography>
      <AddButton
        variant="contained"
        onClick={() => openModal("add")}
        style={{ marginBottom: "20px" }}
      >
        Thêm sản phẩm
      </AddButton>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <TableContainer
        style={{
          maxHeight: "600px",
          overflowY: "auto",
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <StyledTableCell>STT</StyledTableCell>
              <StyledTableCell>Tên sản phẩm</StyledTableCell>
              <StyledTableCell>Giá bán</StyledTableCell>
              <StyledTableCell>Giá gốc</StyledTableCell>
              <StyledTableCell>Mô tả</StyledTableCell>
              <StyledTableCell>Hình ảnh</StyledTableCell>
              <StyledTableCell>Hành động</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  Đang tải...
                </TableCell>
              </TableRow>
            ) : products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  Không có sản phẩm nào!
                </TableCell>
              </TableRow>
            ) : (
              products.map((product, index) => (
                <TableRow key={product.Id}>
                  <TableCell align="center">{index + 1}</TableCell>
                  <TableCell align="center">{product.Name}</TableCell>
                  <TableCell align="center">
                    {product.Price.toLocaleString()} VND
                  </TableCell>
                  <TableCell align="center">
                    {product.OriginalPrice.toLocaleString()} VND
                  </TableCell>
                  <TableCell align="justify">
                    {product.Description || "Không có mô tả"}
                  </TableCell>
                  <TableCell align="center">
                    <img
                      src={product.ImageUrl} // Đã trả về URL đầy đủ từ backend
                      alt={product.Name || "Hình ảnh"}
                      style={{ width: "50px", height: "50px" }}
                    />



                  </TableCell>
                  <TableCell align="center">
                    <StyledButton
                      variant="outlined"
                      color="green"
                      onClick={() => openModal("edit", product)}
                    >
                      Sửa
                    </StyledButton>
                    <StyledButton
                      variant="outlined"
                      color="red"
                      onClick={() => openModal("delete", product)}
                    >
                      Xóa
                    </StyledButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {/* Phân trang */}
      <div style={{ marginTop: "20px", textAlign: "center" }}>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <Button
            key={page}
            variant={page === currentPage ? "contained" : "outlined"}
            onClick={() => setCurrentPage(page)}
            style={{
              margin: "0 5px",
            }}
          >
            {page}
          </Button>
        ))}
      </div>

      <Modal
        open={modalVisible}
        onClose={() => setModalVisible(false)}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={modalStyle}>
          <Typography
            id="modal-title"
            variant="h6"
            component="h2"
            sx={{ marginBottom: 2 }}
          >
            {modalType === "add"
              ? "Thêm sản phẩm"
              : modalType === "edit"
                ? "Sửa sản phẩm"
                : "Xóa sản phẩm"}
          </Typography>
          {modalType === "delete" ? (
            <Typography id="modal-description" sx={{ mb: 2 }}>
              Bạn có chắc chắn muốn xóa sản phẩm này không?
            </Typography>
          ) : (
            <>
              <TextField
                label="Tên sản phẩm"
                fullWidth
                sx={{ mb: 2 }}
                value={currentProduct.Name}
                onChange={(e) =>
                  setCurrentProduct({
                    ...currentProduct,
                    Name: e.target.value,
                  })
                }
              />
              <TextField
                label="Giá bán"
                fullWidth
                sx={{ mb: 2 }}
                value={currentProduct.Price}
                onChange={(e) =>
                  setCurrentProduct({
                    ...currentProduct,
                    Price: e.target.value,
                  })
                }
              />
              <TextField
                label="Giá gốc"
                fullWidth
                sx={{ mb: 2 }}
                value={currentProduct.OriginalPrice}
                onChange={(e) =>
                  setCurrentProduct({
                    ...currentProduct,
                    OriginalPrice: e.target.value,
                  })
                }
              />
              <TextField
                label="Mô tả"
                fullWidth
                sx={{ mb: 2 }}
                value={currentProduct.Description}
                onChange={(e) =>
                  setCurrentProduct({
                    ...currentProduct,
                    Description: e.target.value,
                  })
                }
              />
              <TextField
                label="URL hình ảnh"
                fullWidth
                sx={{ mb: 2 }}
                value={currentProduct.ImageUrl}
                onChange={(e) =>
                  setCurrentProduct({
                    ...currentProduct,
                    ImageUrl: e.target.value,
                  })
                }
              />
            </>
          )}
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={
                modalType === "add"
                  ? handleAddProduct
                  : modalType === "edit"
                    ? handleEditProduct
                    : handleDeleteProduct
              }
            >
              {modalType === "delete" ? "Xóa" : "Lưu"}
            </Button>
            <Button
              variant="outlined"
              color="warning"
              onClick={() => setModalVisible(false)}
            >
              Hủy
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default ProductManager;
