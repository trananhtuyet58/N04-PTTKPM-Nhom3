// Dữ liệu giả lập thông tin cá nhân
const mockProfile = {
    employeeId: "TP001",
    fullName: "Nguyễn Văn An",
    position: "Trưởng Phòng Kế Toán",
    email: "nguyenvanan@company.com",
    phone: "0901234567",
    address: "123 Nguyễn Văn Linh, Quận 7, TP.HCM",
    taxId: "8751234567",
    avatar: "../../assets/images/avatar-default.png",
    password: "Admin@123"
};

// Thêm regex cho validate mật khẩu
const PASSWORD_REGEX = {
    minLength: 8,
    hasUpperCase: /[A-Z]/,
    hasLowerCase: /[a-z]/,
    hasNumber: /[0-9]/,
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/
};

document.addEventListener('DOMContentLoaded', function () {
    loadProfile();
    setupEventListeners();

    // Hiển thị thông báo về mật khẩu mặc định
    // const passwordNote = document.createElement('div');
    // passwordNote.className = 'alert alert-info mt-3';
    // passwordNote.innerHTML = `
    //     <strong>Lưu ý:</strong> Mật khẩu mặc định của bạn là <code>${mockProfile.password}</code>
    //     <br>
    //     <small>Vui lòng đổi mật khẩu để b��o mật tài khoản.</small>
    // `;
    // document.querySelector('.change-password-section').prepend(passwordNote);
});

function loadProfile() {
    // Hiển thị thông tin cá nhân
    document.getElementById('profileName').textContent = mockProfile.fullName;
    document.getElementById('profilePosition').textContent = mockProfile.position;
    document.getElementById('profileAvatar').src = mockProfile.avatar;

    // Điền thông tin vào form
    document.getElementById('employeeId').value = mockProfile.employeeId;
    document.getElementById('fullName').value = mockProfile.fullName;
    document.getElementById('email').value = mockProfile.email;
    document.getElementById('phone').value = mockProfile.phone;
    document.getElementById('address').value = mockProfile.address;
    document.getElementById('taxId').value = mockProfile.taxId;

    // Disable các trường input
    disableFormFields();
}

function setupEventListeners() {
    // Xử lý nút chỉnh sửa
    document.getElementById('editProfileBtn').addEventListener('click', function () {
        enableFormFields();
        toggleEditButtons(true);
    });

    // Xử lý nút hủy
    document.getElementById('cancelEditBtn').addEventListener('click', function () {
        loadProfile();
        toggleEditButtons(false);
    });

    // Xử lý form submit
    document.getElementById('profileForm').addEventListener('submit', function (e) {
        e.preventDefault();
        saveProfile();
    });

    // Xử lý đổi mật khẩu
    document.getElementById('changePasswordBtn').addEventListener('click', changePassword);

    // Xử lý responsive menu
    document.getElementById('toggleMenu')?.addEventListener('click', function () {
        document.querySelector('.sidebar').classList.toggle('active');
        document.querySelector('.main-content').classList.toggle('shifted');
    });

    // Xử lý đăng xuất
    document.getElementById('logoutBtn').addEventListener('click', function () {
        window.location.href = '../../index.html';
    });

    // Thêm validate cho email
    const emailInput = document.getElementById('email');
    emailInput.addEventListener('input', function () {
        if (this.disabled) return;

        if (!this.value) {
            showError(this, 'Email không được để trống');
        } else if (!isValidEmail(this.value)) {
            showError(this, 'Email không đúng định dạng');
        } else {
            clearError(this);
        }
    });

    // Thêm validate cho số điện thoại
    const phoneInput = document.getElementById('phone');
    phoneInput.addEventListener('input', function () {
        if (this.disabled) return;

        // Chỉ cho phép nhập số
        this.value = this.value.replace(/[^0-9]/g, '');

        if (!this.value) {
            showError(this, 'Số điện thoại không được để trống');
        } else if (!isValidPhone(this.value)) {
            showError(this, 'Số điện thoại phải có 10-11 chữ số');
        } else {
            clearError(this);
        }
    });

    // Thêm validate realtime cho mật khẩu mới
    const newPasswordInput = document.getElementById('newPassword');
    newPasswordInput.addEventListener('input', function () {
        const errors = validatePassword(this.value);
        if (errors.length > 0) {
            showError(this, errors.join('<br>'));
        } else {
            clearError(this);
        }
    });

    // Thêm validate realtime cho xác nhận mật khẩu
    const confirmPasswordInput = document.getElementById('confirmPassword');
    confirmPasswordInput.addEventListener('input', function () {
        const newPassword = document.getElementById('newPassword').value;
        if (this.value && this.value !== newPassword) {
            showError(this, 'Mật khẩu xác nhận không khớp');
        } else {
            clearError(this);
        }
    });

    // Đảm bảo các trường mật khẩu luôn có thể nhập
    const passwordFields = ['currentPassword', 'newPassword', 'confirmPassword'];
    passwordFields.forEach(fieldId => {
        const input = document.getElementById(fieldId);
        if (input) {
            input.disabled = false;
        }
    });
}

function enableFormFields() {
    // Chỉ enable các trường có thể chỉnh sửa
    const editableFields = ['email', 'phone', 'address'];
    editableFields.forEach(fieldId => {
        const input = document.getElementById(fieldId);
        if (input) {
            input.disabled = false;
            clearError(input);
        }
    });
}

function disableFormFields() {
    // Chỉ disable các trường thông tin cá nhân, không disable các trường mật khẩu
    const profileInputs = [
        'employeeId',
        'fullName',
        'email',
        'phone',
        'address',
        'taxId'
    ];

    profileInputs.forEach(fieldId => {
        const input = document.getElementById(fieldId);
        if (input) {
            input.disabled = true;
        }
    });
}

function toggleEditButtons(isEditing) {
    document.getElementById('editProfileBtn').classList.toggle('d-none', isEditing);
    document.getElementById('saveProfileBtn').classList.toggle('d-none', !isEditing);
    document.getElementById('cancelEditBtn').classList.toggle('d-none', !isEditing);
}

function saveProfile() {
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;

    // Kiểm tra các trường bắt buộc
    if (!email || !phone || !address) {
        alert('Vui lòng điền đầy đủ thông tin!');
        return;
    }

    // Validate email và số điện thoại
    if (!isValidEmail(email)) {
        alert('Email không đúng định dạng!');
        return;
    }

    if (!isValidPhone(phone)) {
        alert('Số điện thoại không đúng định dạng!');
        return;
    }

    // Nếu tất cả hợp lệ thì lưu thông tin
    mockProfile.email = email;
    mockProfile.phone = phone;
    mockProfile.address = address;

    // Disable form và ẩn nút lưu/hủy
    disableFormFields();
    toggleEditButtons(false);

    // Hiển thị thông báo
    alert('Cập nhật thông tin thành công!');
}

function changePassword() {
    const currentPassword = document.getElementById('currentPassword');
    const newPassword = document.getElementById('newPassword');
    const confirmPassword = document.getElementById('confirmPassword');

    // Reset errors
    clearError(currentPassword);
    clearError(newPassword);
    clearError(confirmPassword);

    // Validate mật khẩu hiện tại
    if (!currentPassword.value) {
        showError(currentPassword, 'Vui lòng nhập mật khẩu hiện tại');
        return;
    }

    // Kiểm tra mật khẩu hiện tại
    if (currentPassword.value !== mockProfile.password) {
        showError(currentPassword, `Mật khẩu hiện tại không đúng (Mật khẩu mặc định: ${mockProfile.password})`);
        return;
    }

    // Validate mật khẩu mới
    const passwordErrors = validatePassword(newPassword.value);
    if (passwordErrors.length > 0) {
        showError(newPassword, passwordErrors.join('<br>'));
        return;
    }

    // Validate xác nhận mật khẩu
    if (!confirmPassword.value) {
        showError(confirmPassword, 'Vui lòng xác nhận mật khẩu mới');
        return;
    }

    if (newPassword.value !== confirmPassword.value) {
        showError(confirmPassword, 'Mật khẩu xác nhận không khớp');
        return;
    }

    // Kiểm tra mật khẩu mới không được trùng mật khẩu cũ
    if (newPassword.value === currentPassword.value) {
        showError(newPassword, 'Mật khẩu mới không được trùng với mật khẩu cũ');
        return;
    }

    // Nếu tất cả hợp lệ
    // Giả lập đổi mật khẩu thành công
    alert('Đổi mật khẩu thành công! Vui lòng đăng nhập lại.');

    // Reset form
    currentPassword.value = '';
    newPassword.value = '';
    confirmPassword.value = '';

    // Redirect về trang đăng nhập
    setTimeout(() => {
        window.location.href = '../../index.html';
    }, 1000);
}

// Thêm các hàm validate
function isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[0-9]{10,11}$/;
    return phoneRegex.test(phone);
}

// Thêm hàm validate mật khẩu
function validatePassword(password) {
    const errors = [];

    if (password.length < PASSWORD_REGEX.minLength) {
        errors.push(`Mật khẩu phải có ít nhất ${PASSWORD_REGEX.minLength} ký tự`);
    }

    if (!PASSWORD_REGEX.hasUpperCase.test(password)) {
        errors.push('Mật khẩu phải chứa ít nhất 1 chữ hoa');
    }

    if (!PASSWORD_REGEX.hasLowerCase.test(password)) {
        errors.push('Mật khẩu phải chứa ít nhất 1 chữ thường');
    }

    if (!PASSWORD_REGEX.hasNumber.test(password)) {
        errors.push('Mật khẩu phải chứa ít nhất 1 số');
    }

    if (!PASSWORD_REGEX.hasSpecialChar.test(password)) {
        errors.push('Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt');
    }

    return errors;
}

// Thêm hàm hiển thị lỗi
function showError(inputElement, message) {
    let errorDiv = inputElement.nextElementSibling;
    if (!errorDiv || !errorDiv.classList.contains('error-message')) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'error-message text-danger small mt-1';
        inputElement.parentNode.appendChild(errorDiv);
    }
    errorDiv.innerHTML = message; // Thay đổi textContent thành innerHTML để hỗ trợ <br>
    inputElement.classList.add('is-invalid');
}

// Thêm hàm xóa lỗi
function clearError(inputElement) {
    const errorDiv = inputElement.nextElementSibling;
    if (errorDiv && errorDiv.classList.contains('error-message')) {
        errorDiv.textContent = '';
    }
    inputElement.classList.remove('is-invalid');
}
