import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './ResetPassword.css';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  if (!email) {
    alert("Email không được xác định. Vui lòng thử lại.");
    navigate('/forgot-password');
    return null;
  }

  // Kiểm tra trạng thái OTP
  useEffect(() => {
    const checkOtpVerified = async () => {
      try {
        await axios.get(`http://dangtringhia1407-001-site1.otempurl.com/api/Users/check-otp-verified?email=${email}`);
      } catch (error) {
        console.error("OTP chưa được xác nhận:", error.response ? error.response.data : error.message);
        setError("Bạn chưa xác nhận OTP hoặc OTP không hợp lệ.");
      }
    };
    checkOtpVerified();
  }, [email]);

  const validateForm = () => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,32}$/;
    if (!newPassword || !confirmPassword) {
      setError("Vui lòng điền đầy đủ thông tin.");
      return false;
    }
    if (newPassword !== confirmPassword) {
      setError("Mật khẩu và xác nhận mật khẩu không khớp.");
      return false;
    }
    if (!passwordRegex.test(newPassword)) {
      setError("Mật khẩu phải có ít nhất một chữ hoa, một chữ số và một ký tự đặc biệt.");
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://dangtringhia1407-001-site1.otempurl.com/api/Users/reset-password', {
        email,
        newPassword,
        confirmPassword,
      });
      console.log("Response:", response.data);
      alert("Mật khẩu của bạn đã được cập nhật thành công.");
      navigate('/login'); // Chuyển hướng tới trang đăng nhập sau khi đặt lại mật khẩu thành công
    } catch (error) {
      console.error('Lỗi khi đặt lại mật khẩu:', error.response ? error.response.data : error.message);
      setError(error.response ? error.response.data : 'Đã xảy ra lỗi trong quá trình đặt lại mật khẩu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-password-wrapper">
      <div className="reset-password-form">
      <div className="logo">
              <img src="src/assets/Icons/logo1.png" alt="Glamour Cosmic Logo" />
            </div>
        <h2>Đặt Lại Mật Khẩu</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Mật Khẩu Mới</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Nhập mật khẩu mới"
              required
            />
          </div>

          <div className="input-group">
            <label>Xác Nhận Mật Khẩu Mới</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Xác nhận mật khẩu mới"
              required
            />
          </div>

          {error && <p className="error-text">{error}</p>}

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Đang cập nhật...' : 'Đặt Lại Mật Khẩu'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
