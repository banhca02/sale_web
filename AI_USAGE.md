# AI_USAGE.md

## 1. Công cụ AI đã dùng
- Gemini 

## 2. Các phần đã dùng AI hỗ trợ
- Phân tích yêu cầu đề bài, lên kiến trúc tổng thể (Backend FastAPI + Frontend React)
- Thiết kế schema database: bảng `users`, `admin_profile`, `sale_profile`, `agencies`, `records`
- Viết API backend: authentication (HttpOnly cookie), phân quyền theo role, CRUD cho Sale/Agency/Record
- Viết component frontend: Dashboard (Metric Cards, Bar Chart), AdminRoute/ProtectedRoute, form đăng ký Sale, Agency, Record
- Debug lỗi và tối ưu query (joinedload, pagination)
- Hỗ trợ viết lệnh Git và xử lý conflict khi push code

## 3. Prompt hiệu quả nhất
**Prompt 1:**
> "Sửa phần lấy danh sách toàn bộ cửa hàng thành lấy danh sách phân trang 10 cửa hàng 1 lần, chỉ lấy các cửa hàng của sale hiện tại đang thao tác"

-> AI giúp chuyển từ query lấy toàn bộ dữ liệu sang cơ chế phân trang `skip/limit`, đồng thời thêm điều kiện lọc theo `sale_id` của user đang đăng nhập.

**Prompt 2:**
> "Hãy viết lệnh tạo 3 bảng đề xuất như trong file, riêng ở phần sale thì tạo 1 bảng user và 2 bảng con liên kết tới nó là sales và admin bằng postgre"

-> AI giúp tạo lệnh khởi tạo cấu trúc cơ sở dữ liệu dựa trên mô hình phân cấp được yêu cầu trong đề bài bao gồm 4 bảng users, admins, sales, agencies, track_records.

## 4. Lỗi AI gây ra và quá trình debug
- **Lỗi điều hướng sai role:** Khi đăng nhập với role admin, do chưa set `loading` về `false` đúng lúc, hệ thống điều hướng nhầm từ `/admin/sales` về `/dashboard`.
- **Lỗi enum ở backend:** Khi thao tác với cột kiểu Enum, code lấy `name` của enum thay vì `value`, dẫn đến sai dữ liệu khi lưu/trả về.

**Cách xử lý:** Khi gặp lỗi, mình chụp lại lỗi và hỏi lại AI. Nếu lỗi phức tạp mà AI không giải quyết được ngay, mình tự debug bằng `console.log`, `print`, và tab Network của trình duyệt để kiểm tra payload/response thực tế, từ đó xác định đúng nguyên nhân và sửa lại.

## 5. Link chia sẻ đoạn chat với AI
https://share.gemini.google/3lHATlrqYFwJ