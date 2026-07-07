# Hệ Thống Quản Lý Sale & Đại Lý (Sale Management System)

Bài làm bài test năng lực vị trí **AI Intern** tại **Vibe Coding**. Hệ thống được xây dựng với kiến trúc phân tách rõ ràng giữa Backend (FastAPI) và Frontend (React Vite), tích hợp cơ chế phân quyền bảo mật 2 lớp và Dashboard theo dõi hiệu suất trực quan.

---

## 🚀 Tính Năng Đã Hoàn Thành (Scope of Work)

Hệ thống đã hiện thực hóa trọn vẹn các yêu cầu cốt lõi (Core Requirements) và các chốt chặn nâng cao:

### 1. Phân Hệ Xác Thực & Phân Quyền (Auth & ACL)
- **HttpOnly Cookie Authentication**: Cơ chế đăng nhập an toàn, chống tấn công XSS bằng cách lưu trữ Token bảo mật trực tiếp trong HttpOnly Cookie phía Backend.
- **Mô Hình Bảng Con Độc Lập (One-to-One)**: Phân quyền động tại API `/auth/me` dựa trên hồ sơ liên kết (`admin_profile` / `sale_profile`), giả lập chuỗi vai trò (`role`) trả về cho Client.
- **Chốt Chặn Bảo Mật Giao Diện (AdminRoute & ProtectedRoute)**: Ngăn chặn tuyệt đối nhân viên Sale cố tình truy cập thủ công vào trang quản trị của Admin thông qua URL.

### 2. Phân Hệ Admin (Quản Trị Hệ Thống)
- **Cấp Tài Khoản Sale**: Form đăng ký lồng dữ liệu phức tạp (`Nested Object Schema`), tự động khởi tạo chỉ tiêu doanh thu (`target_revenue`) riêng biệt cho từng nhân viên.
- **Giám Sát Đội Ngũ**: Bảng theo dõi toàn bộ nhân viên Sale đang hoạt động kèm theo KPI thực tế được đồng bộ qua câu lệnh truy vấn nạp sớm `joinedload` tối ưu.

### 3. Phân Hệ Sale & Đại Lý
- **Tổng Quan Công Việc (Dashboard)**: Hệ thống Thẻ chỉ số (Metric Cards) và **Biểu đồ cột (Bar Chart)** trực quan hóa tỉ lệ phân bổ trạng thái của toàn bộ lượt Track số do Sale đó phụ trách.
- **Quản Lý Đại Lý (Agencies)**: Tính năng tìm kiếm và phân trang mượt mà dựa trên cơ chế `skip/limit` (Offset-based pagination), đảm bảo tải dữ liệu tốc độ cao.
- **Nhật Ký Track Số (Records)**: Thao tác thêm mới, lưu vết lịch sử tương tác khách hàng của Đại lý với bộ tag màu trạng thái đồng bộ nghiêm ngặt với hệ thống `Enum` ở Database.

---

## 🛠️ Công Nghệ Sử Dụng (Tech Stack)

| Thành phần | Công nghệ / Thư viện |
| :--- | :--- |
| **Backend** | Python 3.10+, FastAPI, SQLAlchemy, Pydantic, Uvicorn, PostgreSQL |
| **Frontend** | ReactJS, Vite, Tailwind CSS v4, Axios, Recharts, Lucide React, React Router v6 |
| **Hỗ trợ** | Cursor, Gemini AI (Tuân thủ theo `AI_USAGE.md`) |

---

## 💻 Hướng Dẫn Cài Đặt & Chạy Cục Bộ (Setup Instruction)

### 1. Cài đặt và Chạy Backend (FastAPI)

Di chuyển vào thư mục backend:

```bash
cd sale_backend
```

Khởi tạo môi trường ảo Python và kích hoạt:

```bash
# Windows
python -m venv .venv
.venv\Scripts\activate

# macOS / Linux
python3 -m venv .venv
source .venv/bin/activate
```

Cài đặt các gói thư viện phụ thuộc:

```bash
pip install -r requirements.txt
```

Khởi chạy máy chủ Backend (Localhost:8000):

```bash
uvicorn app.main:app --reload
```

### 2. Cài đặt và Chạy Frontend (React Vite)

Mở một Terminal mới và di chuyển vào thư mục frontend:

```bash
cd sale_frontend
```

Cài đặt các gói thư viện Node.js:

```bash
npm install
```

Khởi chạy môi trường phát triển Frontend (Localhost:5173):

```bash
npm run dev
```
