import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Đảm bảo Link được import
import axios from 'axios';
import './Login.css';
import { API_BASE_URL } from '../config';
const Login = () => {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  // const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const loginAPI = async (user, pass) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/Users/login`, {
        EmailOrUsername: user,
        Password: pass,
      });
      return res
    } catch (error) {
      console.log(error);

    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const res = await loginAPI(emailOrUsername, password)

    switch (res.status) {
      case 200:
        const { $values } = res.data.roles;
        const token = res.data.token?.Result; // Lấy chuỗi token từ thuộc tính Resul

        if (!token) {
          throw new Error('Không nhận được token hợp lệ từ server.');
        }

        switch ($values[0]) {
          case "Admin":
            navigate("/admin")
            break;
          case "Staff":
            navigate("/staff")
            break;
          case "Customer":
            navigate("/")
            break;
          default:
            break;
        }

        localStorage.setItem('token', token);
        localStorage.setItem('userName', res.data.userName);
        localStorage.setItem('roles', JSON.stringify($values[0]));
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    localStorage.removeItem('roles')
    localStorage.removeItem('token')
    localStorage.removeItem('userName')
  }, [])

  return (
    <div className="login-wrapper">
      <div className="login-page">
        <div className="login-container">
          <div className="login-form">
            <div className="logo">
              <img src="/imgs/Icons/logo1.png" alt="Glamour Cosmic Logo" />
            </div>
            <h2>ĐĂNG NHẬP</h2>
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label>Email hoặc Tên đăng nhập</label>
                <input
                  type="text"
                  value={emailOrUsername}
                  onChange={(e) => setEmailOrUsername(e.target.value)}
                  required
                  placeholder="Nhập email hoặc tên đăng nhập của bạn"
                />
              </div>
              <div className="input-group">
                <label>Mật Khẩu</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Nhập mật khẩu của bạn"
                />
              </div>
              <div className="forgot-password">
                <Link to="/forgot-password">Quên mật khẩu?</Link>
              </div>
              {/* {error && <p className="error-text">{error}</p>} */}
              <button type="submit" className="login-button" disabled={loading}>
                {loading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
              </button>
            </form>
            <p>Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
