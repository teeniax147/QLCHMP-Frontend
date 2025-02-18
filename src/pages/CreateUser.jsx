import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Typography,
  Alert,
} from "@mui/material";

const CreateUser = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    firstName: "",
    lastName: "",
    address: "",
    password: "",
    role: "Staff",
  });
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://dangtringhia1407-001-site1.otempurl.com/api/Users/create-user",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Token hợp lệ
          },
        }
      );
  
      console.log("Response:", response); // Debug response từ API
      setMessage({ type: "success", text: response.data }); // Hiển thị thông báo thành công
    } catch (error) {
      console.error("Error:", error); // Debug lỗi
      const errMessage =
        error.response?.data || "Đã xảy ra lỗi không xác định từ hệ thống.";
      setMessage({ type: "error", text: errMessage });
    }
  };
  

  return (
    <Box
      component="form"
      sx={{
        maxWidth: 500,
        mx: "auto",
        mt: 5,
        p: 3,
        border: "1px solid #ccc",
        borderRadius: 2,
      }}
      onSubmit={handleSubmit}
    >
      <Typography variant="h5" sx={{ mb: 3, textAlign: "center" }}>
        Phân Quyền Người Dùng
      </Typography>
      {message.text && (
        <Alert severity={message.type} sx={{ mb: 3 }}>
          {message.text}
        </Alert>
      )}
      <TextField
        fullWidth
        label="Tên tài khoản"
        name="username"
        value={formData.username}
        onChange={handleChange}
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="Email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="Số điện thoại"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="Họ"
        name="firstName"
        value={formData.firstName}
        onChange={handleChange}
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="Tên"
        name="lastName"
        value={formData.lastName}
        onChange={handleChange}
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="Địa chỉ"
        name="address"
        value={formData.address}
        onChange={handleChange}
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        type="password"
        label="Mật khẩu"
        name="password"
        value={formData.password}
        onChange={handleChange}
        sx={{ mb: 2 }}
      />
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel id="role-label">Vai trò</InputLabel>
        <Select
          labelId="role-label"
          name="role"
          value={formData.role}
          onChange={handleChange}
        >
          <MenuItem value="Admin">Admin</MenuItem>
          <MenuItem value="Staff">Staff</MenuItem>
        </Select>
      </FormControl>
      <Button variant="contained" color="primary" fullWidth type="submit">
        Tạo Người Dùng
      </Button>
    </Box>
  );
};

export default CreateUser;
