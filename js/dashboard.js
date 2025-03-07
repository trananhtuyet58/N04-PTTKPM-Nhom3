document.addEventListener('DOMContentLoaded', function () {
    // Kiểm tra đăng nhập
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser || currentUser.role !== 'nhan_vien') {
        window.location.href = '../../index.html';
        return;
    }

    // Cập nhật tên người dùng
    document.getElementById('userName').textContent = currentUser.fullName;

    // Cập nhật ngày hiện tại
    updateCurrentDate();

    // Load dữ liệu
    loadDashboardData();

    // Xử lý đăng xuất
    document.getElementById('logoutBtn').addEventListener('click', logout);
});

function updateCurrentDate() {
    const currentDate = new Date();
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    document.getElementById('currentDate').textContent =
        currentDate.toLocaleDateString('vi-VN', options);
}

function loadDashboardData() {
    // Khởi tạo dữ liệu mẫu
    const mockData = {
        totalEmployees: 5,
        totalSalary: 85000000,
        totalTax: 4200000,
        completedReports: 12,
        recentActivities: [
            {
                type: 'salary',
                description: 'Đã cập nhật bảng lương tháng 12/2023',
                time: '2 giờ trước'
            },
            {
                type: 'employee',
                description: 'Thêm nhân viên mới: Nguyễn Văn A',
                time: '1 ngày trước'
            },
            {
                type: 'tax',
                description: 'Hoàn thành quyết toán thuế năm 2023',
                time: '2 ngày trước'
            },
            {
                type: 'report',
                description: 'Xuất báo cáo thuế TNCN quý 4/2023',
                time: '3 ngày trước'
            }
        ]
    };

    // Cập nhật thống kê
    updateDashboardStats(mockData);
    // Cập nhật hoạt động gần đây
    updateRecentActivities(mockData.recentActivities);
}

function updateDashboardStats(data) {
    document.getElementById('totalEmployees').textContent = data.totalEmployees;
    document.getElementById('totalSalary').textContent = formatCurrency(data.totalSalary);
    document.getElementById('totalTax').textContent = formatCurrency(data.totalTax);
    document.getElementById('completedReports').textContent = data.completedReports;
}

function updateRecentActivities(activities) {
    const activityList = document.getElementById('activityList');
    activityList.innerHTML = '';

    activities.forEach(activity => {
        const icon = getActivityIcon(activity.type);
        const activityItem = document.createElement('div');
        activityItem.className = 'activity-item d-flex align-items-center';
        activityItem.innerHTML = `
            <div class="mr-3">
                <i class="${icon}"></i>
            </div>
            <div>
                <div class="font-weight-bold">${activity.description}</div>
                <small class="text-muted">${activity.time}</small>
            </div>
        `;
        activityList.appendChild(activityItem);
    });
}

function getActivityIcon(type) {
    const icons = {
        salary: 'fas fa-money-bill-wave text-success',
        employee: 'fas fa-user-plus text-primary',
        tax: 'fas fa-file-invoice-dollar text-warning',
        report: 'fas fa-file-alt text-info'
    };
    return icons[type] || 'fas fa-info-circle';
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
}

// Xử lý responsive menu
document.getElementById('toggleMenu')?.addEventListener('click', function () {
    document.querySelector('.sidebar').classList.toggle('active');
    document.querySelector('.main-content').classList.toggle('shifted');
});

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = '../../index.html';
}
