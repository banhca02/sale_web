import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { Home, ArrowLeft, Plus, ChevronLeft, ChevronRight, ClipboardList, DollarSign, Calendar, Tag } from 'lucide-react';

function Records() {
  const { id } = useParams(); // Lấy agency_id từ URL đường dẫn động
  const navigate = useNavigate();

  // State quản lý danh sách track số và phân trang
  const [records, setRecords] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // State quản lý Modal thêm Track số mới
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ customer_name: '', estimated_revenue: '', status: 'Mới', notes: '' });
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  // Hàm fetch danh sách track số từ server
  const fetchRecords = async () => {
    const limit = itemsPerPage;
    const skip = (currentPage - 1) * limit;

    try {
      // Gọi API kèm theo filter agency_id và cặp số skip/limit
      const response = await axiosClient.get(`/record/?agency_id=${id}&skip=${skip}&limit=${limit}`);
      setRecords(response.items || []);
      setTotalItems(response.total || 0);
    } catch (error) {
      console.error('Không thể lấy danh sách track số:', error);
    }
  };

  // Tự động chạy lại khi đổi số trang
  useEffect(() => {
    fetchRecords();
  }, [currentPage]);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Xử lý submit form tạo mới track số
  const handleCreateRecord = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      await axiosClient.post('/record/', {
        customer_name: formData.customer_name,
        estimated_revenue: parseFloat(formData.estimated_revenue),
        status: formData.status,
        notes: formData.notes,
        agency_id: parseInt(id, 10) // Gán trực tiếp ID đại lý từ URL
      });

      // Reset form, đóng modal và refresh lại bảng dữ liệu
      setFormData({ customer_name: '', estimated_revenue: '', status: 'Mới', notes: '' });
      setIsModalOpen(false);
      setCurrentPage(1); // Quay về trang 1 để xem bản ghi mới nhất
      fetchRecords();
    } catch (error) {
      setErrorMsg(error.response?.data?.detail || 'Lỗi khi thêm mới track số.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* --- THANH CÔNG CỤ PHÍA TRÊN (3 NÚT NHƯ YÊU CẦU) --- */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Cụm bên trái: 2 nút điều hướng */}
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => navigate('/dashboard')}
              className="flex items-center space-x-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm py-2 px-3 rounded-xl border border-slate-300 transition cursor-pointer"
            >
              <Home size={16} />
              <span className="hidden sm:inline">Trang chủ</span>
            </button>

            <button 
              onClick={() => navigate('/agencies')}
              className="flex items-center space-x-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm py-2 px-3 rounded-xl border border-slate-300 transition cursor-pointer"
            >
              <ArrowLeft size={16} />
              <span>Trang đại lý</span>
            </button>
          </div>

          <span className="text-base font-bold text-slate-800 tracking-tight">
            Nhật ký Track Số Đại Lý #{id}
          </span>

          {/* Cụm bên phải: Nút thêm track số */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm py-2 px-4 rounded-xl transition shadow-sm flex items-center space-x-2 cursor-pointer"
          >
            <Plus size={18} />
            <span>Thêm track số</span>
          </button>
          
        </div>
      </header>

      {/* --- BẢNG HIỂN THỊ DỮ LIỆU PHÂN TRANG --- */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm font-semibold">
                  <th className="p-4">Tên khách hàng / Đơn hàng</th>
                  <th className="p-4">Doanh thu dự kiến</th>
                  <th className="p-4">Trạng thái</th>
                  <th className="p-4">Ghi chú</th>
                  <th className="p-4">Ngày cập nhật</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 text-sm">
                {records.length > 0 ? (
                  records.map((record) => (
                    <tr key={record.id} className="hover:bg-slate-50/70 transition">
                      <td className="p-4 font-semibold text-slate-900 flex items-center space-x-2.5">
                        <ClipboardList size={18} className="text-slate-400" />
                        <span>{record.customer_name}</span>
                      </td>
                      <td className="p-4 font-medium text-slate-900">
                        <div className="flex items-center text-emerald-600 font-bold">
                          <DollarSign size={14} />
                          <span>{record.estimated_revenue.toLocaleString('vi-VN')} đ</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border transition-colors ${
                          record.status === 'Mới'
                            ? 'bg-slate-100 text-slate-700 border-slate-200' // MỚI: Xám
                            : record.status === 'Đã liên hệ'
                            ? 'bg-yellow-50 text-yellow-700 border-yellow-200' // ĐÃ LIÊN HỆ: Vàng
                            : record.status === 'Tiềm năng'
                            ? 'bg-orange-50 text-orange-700 border-orange-200' // TIỀM NĂNG: Cam
                            : record.status === 'Chốt'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200' // CHỐT: Xanh lá
                            : record.status === 'Mất'
                            ? 'bg-red-50 text-red-700 border-red-200' // MẤT: Đỏ
                            : 'bg-slate-100 text-slate-700 border-slate-200' // Dự phòng mặc định
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                            record.status === 'Mới' ? 'bg-slate-400' :
                            record.status === 'Đã liên hệ' ? 'bg-yellow-500' :
                            record.status === 'Tiềm năng' ? 'bg-orange-500' :
                            record.status === 'Chốt' ? 'bg-emerald-500' : 'bg-red-500'
                          }`}></span>
                          
                          {record.status}
                        </span>
                      </td>
                      <td className="p-4 text-slate-500 max-w-xs truncate">{record.notes || '-'}</td>
                      <td className="p-4 text-slate-400">
                        <div className="flex items-center space-x-1">
                          <Calendar size={14} />
                          <span>{new Date(record.created_at).toLocaleDateString('vi-VN')}</span>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-slate-400 font-medium">
                      Chưa có lịch sử track số nào được ghi nhận cho đại lý này.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* HỆ THỐNG NÚT PHÂN TRANG (PAGINATION) */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-slate-200 flex items-center justify-between bg-white">
              <span className="text-sm text-slate-500">
                Hiển thị trong tổng số <span className="font-semibold text-slate-800">{totalItems}</span> bản ghi track số
              </span>

              <div className="flex items-center space-x-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                  className="p-2 border border-slate-300 rounded-xl hover:bg-slate-50 disabled:opacity-40 transition cursor-pointer"
                >
                  <ChevronLeft size={16} />
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1.5 rounded-xl text-sm font-semibold transition cursor-pointer ${
                      currentPage === page ? 'bg-indigo-600 text-white' : 'border border-slate-300 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  className="p-2 border border-slate-300 rounded-xl hover:bg-slate-50 disabled:opacity-40 transition cursor-pointer"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* --- MODAL POPUP THÊM TRACK SỐ --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl p-6 border border-slate-200">
            <h2 className="text-xl font-bold text-slate-800 mb-1">Thêm track số mới</h2>
            <p className="text-slate-500 text-xs mb-4">Ghi nhận thông tin giao dịch lâm sàng hoặc đơn hàng bán được cho đại lý này.</p>

            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-medium rounded-xl mb-4">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleCreateRecord} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tên khách hàng / Nhãn đơn hàng *</label>
                <input
                  type="text" required placeholder="Ví dụ: Đơn thuốc Kháng sinh đợt B"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  value={formData.customer_name} onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Doanh thu dự kiến (đ) *</label>
                  <input
                    type="number" required placeholder="Nhập số tiền"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                    value={formData.estimated_revenue} onChange={(e) => setFormData({ ...formData, estimated_revenue: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Trạng thái xử lý</label>
                  <select
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl bg-white focus:outline-hidden"
                    value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="Mới">Mới</option>
                    <option value="Đã liên hệ">Đã liên hệ</option>
                    <option value="Tiềm năng">Tiềm năng</option>
                    <option value="Chốt">Chốt</option>
                    <option value="Mất">Mất</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Ghi chú chi tiết</label>
                <textarea
                  rows="3" placeholder="Nhập diễn biến tư vấn hoặc lưu ý..."
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
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
                  {loading ? 'Đang lưu...' : 'Lưu bản ghi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Records;