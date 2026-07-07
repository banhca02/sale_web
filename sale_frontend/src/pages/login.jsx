import React, { useState } from 'react';
import axiosClient from '../api/axiosClient';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  
  const { login, user } = useAuth();
  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const response = await axiosClient.post('/login', { email, password });
      login(); 
      const userProfile = await axiosClient.get('/me');
      if (userProfile.role === 'admin') {
        navigate('/admin/sales');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      setErrorMsg(error.response?.data?.detail || 'Đã có lỗi xảy ra.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Vibe Coding</h1>
          <p className="text-slate-500 mt-2">Hệ thống quản lý chuỗi Sale & Đại lý</p>
        </div>

        {/* Thông báo Lỗi nếu có */}
        {errorMsg && (
          <div className="p-4 rounded-xl mb-6 text-sm font-medium bg-red-50 text-red-700 border border-red-200">
            {errorMsg}
          </div>
        )}

        {/* Thông báo Thành công nếu có */}
        {successMsg && (
          <div className="p-4 rounded-xl mb-6 text-sm font-medium bg-green-50 text-green-700 border border-green-200">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Email tài khoản</label>
            <input
              type="email"
              required
              placeholder="admin@gmail.com, sale@gmail.com..."
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Mật khẩu</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-xl transition duration-200 shadow-md disabled:bg-indigo-400 cursor-pointer text-center"
          >
            {loading ? 'Đang xác thực...' : 'Đăng nhập'}
          </button>
        </form>

      </div>
    </div>
  );
}

export default Login;