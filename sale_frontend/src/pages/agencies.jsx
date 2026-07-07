import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { Home, Plus, ChevronLeft, ChevronRight, MapPin, Store, User } from 'lucide-react';

function Agencies() {
  const navigate = useNavigate();

  // State quản lý danh sách và phân trang
  const [agencies, setAgencies] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // State quản lý Modal thêm mới
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', address: '', region: 'Miền Nam' });
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchAgencies = async () => {
    const limit = itemsPerPage;
    const skip = (currentPage - 1) * limit;

    try {
        const response = await axiosClient.get(`/agency/?skip=${skip}&limit=${limit}`);
        
        setAgencies(response.items || []); 
        setTotalItems(response.total || 0); // Lưu tổng số lượng bản ghi vào state
    } catch (error) {
        console.error('Không thể lấy danh sách đại lý:', error);
    }
  };

  useEffect(() => {
    fetchAgencies();
  }, [currentPage]);

  // Logic tính toán phân trang Client-side
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handleCreateAgency = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
        // Chỉ cần gửi 3 trường này, Backend tự động biết ai đang gửi nhờ HttpOnly Cookie đi kèm
        await axiosClient.post('/agency/', {
        name: formData.name,
        address: formData.address,
        region: formData.region,
        });

        // Reset form, đóng modal và làm mới danh sách
        setFormData({ name: '', address: '', region: 'Miền Nam' });
        setIsModalOpen(false);
        fetchAgencies();
    } catch (error) {
        setErrorMsg(error.response?.data?.detail || 'Lỗi khi tạo mới đại lý.');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* --- THANH CÔNG CỤ PHÍA TRÊN (CHỈ CÓ TÊN HỆ THỐNG VÀ 2 NÚT) --- */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Nút 1: Trở về trang chủ */}
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center space-x-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm py-2 px-4 rounded-xl border border-slate-300 transition duration-150 shadow-xs cursor-pointer"
          >
            <Home size={18} />
            <span>Trở về trang chủ</span>
          </button>

          <span className="text-lg font-bold text-slate-800 tracking-tight">
            Quản lý Phân Phối
          </span>

          {/* Nút 2: Thêm đại lý */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm py-2 px-4 rounded-xl transition duration-150 shadow-sm flex items-center space-x-2 cursor-pointer"
          >
            <Plus size={18} />
            <span>Thêm đại lý</span>
          </button>
          
        </div>
      </header>

      {/* --- NỘI DUNG HIỂN THỊ PHÂN TRANG PHÍA DƯỚI --- */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-800">Danh sách đại lý</h1>
          <p className="text-slate-500 text-sm mt-1">Theo dõi hệ thống đại lý cửa hàng đang hoạt động.</p>
        </div>

        {/* Bảng danh sách đại lý */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm font-semibold">
                  <th className="p-4">Tên đại lý</th>
                  <th className="p-4">Khu vực</th>
                  <th className="p-4">Địa chỉ</th>
                  <th className="p-4 text-center">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 text-sm">
                {agencies.length > 0 ? (
                  agencies.map((agency) => (
                    <tr key={agency.id} className="hover:bg-slate-50/70 transition">
                      <td className="p-4 font-semibold text-slate-900 flex items-center space-x-2.5">
                        <Store size={18} className="text-slate-400" />
                        <span>{agency.name}</span>
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                          {agency.region}
                        </span>
                      </td>
                      <td className="p-4 text-slate-500 max-w-xs truncate">
                        <div className="flex items-center space-x-1">
                          <MapPin size={14} className="text-slate-400 shrink-0" />
                          <span className="truncate">{agency.address}</span>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <button
                            onClick={() => navigate(`/agencies/${agency.id}`)}
                            className="inline-flex items-center text-xs font-semibold text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition duration-150 cursor-pointer"
                        >
                            Xem chi tiết
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="p-8 text-center text-slate-400 font-medium">
                      Chưa có đại lý nào được ghi nhận trên hệ thống.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* --- THANH PHÂN TRANG (PAGINATION) --- */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-slate-200 flex items-center justify-between bg-white">
              <span className="text-sm text-slate-500">
                Hiển thị <span className="font-semibold text-slate-800">{indexOfFirstItem + 1}</span> -{' '}
                <span className="font-semibold text-slate-800">
                  {indexOfLastItem > agencies.length ? agencies.length : indexOfLastItem}
                </span>{' '}
                trong tổng số <span className="font-semibold text-slate-800">{totalItems}</span> đại lý
              </span>

              <div className="flex items-center space-x-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                  className="p-2 border border-slate-300 rounded-xl hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent transition cursor-pointer"
                >
                  <ChevronLeft size={16} />
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1.5 rounded-xl text-sm font-semibold transition cursor-pointer ${
                      currentPage === page
                        ? 'bg-indigo-600 text-white'
                        : 'border border-slate-300 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  className="p-2 border border-slate-300 rounded-xl hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent transition cursor-pointer"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* --- MODAL POPUP THÊM ĐẠI LÝ MỚI --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl p-6 border border-slate-200">
            <h2 className="text-xl font-bold text-slate-800 mb-2">Thêm đại lý mới</h2>
            <p className="text-slate-500 text-xs mb-4">Nhập thông tin đại lý và gán mã số nhân viên Sale chịu trách nhiệm hoạt động.</p>

            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-medium rounded-xl mb-4">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleCreateAgency} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tên đại lý *</label>
                <input
                  type="text" required placeholder="Ví dụ: Cửa hàng An Tâm 1"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Địa chỉ cụ thể *</label>
                <input
                  type="text" required placeholder="Số nhà, tên đường, quận/huyện..."
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Khu vực</label>
                <select
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl bg-white focus:outline-hidden"
                value={formData.region} onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                >
                <option value="Miền Nam">Miền Nam</option>
                <option value="Miền Trung">Miền Trung</option>
                <option value="Miền Bắc">Miền Bắc</option>
                </select>
              </div>

              <div className="pt-4 flex items-center justify-end space-x-3 border-t border-slate-100">
                <button
                  type="button" onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit" disabled={loading}
                  className="px-4 py-2 text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-indigo-400 rounded-xl shadow-xs cursor-pointer"
                >
                  {loading ? 'Đang lưu...' : 'Lưu lại'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Agencies;