import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosClient from '../api/axiosClient';
import { UserPlus, Users, ShieldAlert, LogOut, CheckCircle, XCircle } from 'lucide-react';

function AdminSales() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [sales, setSales] = useState([]);
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    full_name: '',
    password: '',
    target_revenue: ''
  });
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const fetchAllSales = async () => {
    try {
      const data = await axiosClient.get('/sales/'); 
      setSales(data);
    } catch (error) {
      console.error('Không thể tải danh sách sale:', error);
    }
  };

  useEffect(() => {
    fetchAllSales();
  }, []);

  const handleCreateSale = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    const payload = {
      user: {
        email: formData.email,
        phone: formData.phone || null, 
        full_name: formData.full_name,
        status: "Đang làm",            
        password: formData.password
      },
      target_revenue: parseFloat(formData.target_revenue) || 0 // Ép kiểu số thực/số nguyên
    };
    try {
      await axiosClient.post('/', payload);
      setSuccessMsg(`Kích hoạt tài khoản Sale cho [${formData.full_name}] thành công!`);
      setFormData({ email: '', phone: '', full_name: '', password: '', target_revenue: '' });
      fetchAllSales(); 
    } catch (error) {
      setErrorMsg(error.response?.data?.detail || 'Lỗi khi tạo tài khoản nhân viên Sale.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axiosClient.post('/auth/logout');
    } finally {
      logout();
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* HEADER DÀNH RIÊNG CHO ADMIN */}
      <header className="bg-slate-900 text-white sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-9 h-9 bg-red-600 rounded-xl flex items-center justify-center text-white font-black text-lg">A</div>
            <span className="text-lg font-bold tracking-tight">Hệ thống Quản trị (Admin Panel)</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-xs bg-red-500/20 text-red-400 border border-red-500/30 px-2.5 py-0.5 rounded-full font-bold uppercase">
              {user?.role}
            </span>
            <span className="text-sm font-medium text-slate-300">{user?.full_name}</span>
            <button onClick={handleLogout} className="text-sm font-semibold text-slate-400 hover:text-red-400 flex items-center space-x-1 cursor-pointer">
              <LogOut size={16} />
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>
      </header>

      {/* NỘI DUNG CHÍNH CHIA LÀM 2 PHÂN KHU */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* KHU VỰC 1: FORM TẠO MỚI SALE (Rộng 1 cột) */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
            <div className="flex items-center space-x-2 mb-4 border-b border-slate-100 pb-3">
              <UserPlus className="text-indigo-600" size={20} />
              <h2 className="text-lg font-bold text-slate-800">Cấp tài khoản Sale</h2>
            </div>

            {errorMsg && <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl mb-4">{errorMsg}</div>}
            {successMsg && <div className="p-3 bg-green-50 border border-green-200 text-green-700 text-xs font-semibold rounded-xl mb-4">{successMsg}</div>}

            <form onSubmit={handleCreateSale} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tên đăng nhập (Username) *</label>
                <input
                  type="text" required placeholder="VD: sale_annguyen"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Họ và tên nhân viên *</label>
                <input
                  type="text" required placeholder="VD: Nguyễn Văn An"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  value={formData.full_name} onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Địa chỉ Email *</label>
                <input
                  type="email" required placeholder="an.nguyen@vibe.com"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mật khẩu khởi tạo *</label>
                <input
                  type="password" required placeholder="Nhập mật khẩu an toàn"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>

              <button
                type="submit" disabled={loading}
                className="w-full mt-2 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl transition shadow-xs cursor-pointer"
              >
                {loading ? 'Đang kích hoạt...' : 'Kích hoạt tài khoản'}
              </button>
            </form>
          </div>
        </div>

        {/* KHU VỰC 2: BẢNG DANH SÁCH SALE HIỆN CÓ (Rộng 2 cột) */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center space-x-2">
              <Users className="text-slate-500" size={20} />
              <h2 className="text-sm font-bold text-slate-700">Đội ngũ nhân viên Sale trong hệ thống</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-200 text-slate-500 text-xs font-bold uppercase tracking-wider">
                    <th className="p-4">Nhân viên</th>
                    <th className="p-4">Username</th>
                    <th className="p-4">Email</th>
                    <th className="p-4 text-center">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 text-sm">
                  {sales.length > 0 ? (
                    sales.map((sale) => (
                      <tr key={sale.id} className="hover:bg-slate-50/50 transition">
                      <td className="p-4 font-semibold text-slate-900">{sale.user.full_name}</td>
                      <td className="p-4 text-slate-500">{sale.user.email}</td>
                      <td className="p-4 text-slate-500">
                        {/* Hiển thị thêm số KPI doanh thu cho oai */}
                        {sale.target_revenue.toLocaleString('vi-VN')} đ
                      </td>
                      <td className="p-4 text-center">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${
                          sale.user.status === 'ACTIVE' || sale.user.status === 'Đang làm'
                            ? 'bg-green-50 text-green-700 border border-green-200' 
                            : 'bg-red-50 text-red-700 border border-red-200'
                        }`}>
                          {sale.user.status}
                        </span>
                      </td>
                    </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="p-8 text-center text-slate-400 font-medium">Chưa có nhân viên Sale nào tồn tại.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}

export default AdminSales;