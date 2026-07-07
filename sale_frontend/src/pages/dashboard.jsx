import React, { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Store, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

function Dashboard() {
  const [data, setData] = useState(null);
  const navigate = useNavigate(); 
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await axiosClient.post('/logout');
    } catch (error) {
      console.error('Lỗi khi đăng xuất:', error);
    } finally {
      logout();
      navigate('/login');
    }
  };

  const handleNavigateToAgencies = () => {
    navigate('/agencies');
  };
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axiosClient.get('/dashboard');
        setData(response); 
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu dashboard:", error);
      }
    };
    fetchDashboardData();
  }, []);

  if (!data) return <div className="p-8 text-center">Đang tải dashboard...</div>;

  const chartData = [
    { name: 'Mới', value: data.status_distribution['Mới'], color: '#94a3b8' },         // Xám
    { name: 'Đã liên hệ', value: data.status_distribution['Đã liên hệ'], color: '#eab308' }, // Vàng
    { name: 'Tiềm năng', value: data.status_distribution['Tiềm năng'], color: '#f97316' },  // Cam
    { name: 'Chốt', value: data.status_distribution['Chốt'], color: '#10b981' },       // Xanh lá
    { name: 'Mất', value: data.status_distribution['Mất'], color: '#ef4444' },         // Đỏ
  ];
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* 1. THANH CÔNG CỤ PHÍA TRÊN (TOP NAVIGATION BAR) */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Bên trái: Logo hệ thống */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.location.reload()}>
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-sm">
              V
            </div>
            <span className="text-xl font-bold text-slate-800 tracking-tight hidden sm:block">
              Vibe Dashboard
            </span>
          </div>

          {/* Bên phải: Tên user, Nút Quản lý đại lý & Đăng xuất */}
          <div className="flex items-center space-x-4">
            
            {/* Hiển thị tên người dùng
            <div className="flex items-center space-x-2 bg-slate-100 py-1.5 px-3 rounded-xl border border-slate-200">
              <div className="w-6 h-6 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-xs font-bold uppercase">
               
              </div>
              <span className="text-sm font-semibold text-slate-700 max-w-[120px] sm:max-w-[200px] truncate">
              
              </span>
            </div> */}

            {/* Nút Quản lý đại lý */}
            <button
              onClick={handleNavigateToAgencies}
              className="bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm py-2 px-4 rounded-xl border border-slate-300 transition duration-150 shadow-xs cursor-pointer flex items-center space-x-2"
            >
              <span>Quản lý đại lý</span>
            </button>

            {/* Nút Đăng xuất */}
            <button
              onClick={handleLogout}
              className="bg-red-50 hover:bg-red-100 text-red-600 font-semibold text-sm py-2 px-4 rounded-xl border border-red-200 transition duration-150 cursor-pointer"
            >
              Đăng xuất
            </button>

          </div>
        </div>
      </header>

      {/* 2. KHU VỰC HIỂN THỊ NỘI DUNG PHÍA DƯỚI */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="p-6 bg-slate-50 min-h-screen font-sans">
          <h1 className="text-xl font-bold text-slate-800 mb-6">Tổng quan công việc</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 flex items-center justify-between shadow-xs">
              <div>
                <p className="text-sm font-semibold text-slate-500">Tổng số Đại lý quản lý</p>
                <h3 className="text-3xl font-black text-slate-900 mt-1">{data.total_agencies}</h3>
              </div>
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl"><Store size={24} /></div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 flex items-center justify-between shadow-xs">
              <div>
                <p className="text-sm font-semibold text-slate-500">Tổng số lượng Track số</p>
                <h3 className="text-3xl font-black text-slate-900 mt-1">{data.total_records}</h3>
              </div>
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><BarChart3 size={24} /></div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs max-w-2xl">
            <h2 className="text-sm font-bold text-slate-700 mb-1">Số lượng Track số theo trạng thái</h2>
            <p className="text-xs text-slate-400 mb-6">Thống kê tổng hợp trên toàn bộ khu vực đại lý được phân công quản lý.</p>
            
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }} // Thu hẹp margin trái để tối ưu diện tích hiển thị số
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
                  />
                  
                  <YAxis 
                    allowDecimals={false} 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                  />

                  <Tooltip 
                    cursor={{ fill: '#f8fafc' }} 
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
                    labelStyle={{ fontWeight: 'bold', color: '#1e293b' }}
                    formatter={(value) => [`${value} lượt track`, 'Số lượng']}
                  />

                  <Bar dataKey="value" radius={[8, 8, 0, 0]} maxBarSize={50}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;