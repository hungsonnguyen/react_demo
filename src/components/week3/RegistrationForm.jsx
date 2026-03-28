import { useState } from "react";

export default function RegistrationForm() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Tên không được rỗng";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email.trim()) {
      newErrors.email = "Email không được rỗng";
    } else if (!emailRegex.test(form.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!form.password) {
      newErrors.password = "Mật khẩu không được rỗng";
    } else if (form.password.length < 6) {
      newErrors.password = "Mật khẩu phải >= 6 ký tự";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateField = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear error khi user bắt đầu chỉnh sửa
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      setSubmitted(true);
      alert(`Đăng ký thành công!\nTên: ${form.name}\nEmail: ${form.email}`);
      setForm({ name: "", email: "", password: "" });
      setSubmitted(false);
    }
  };

  return (
    <form className="registration-form" onSubmit={handleSubmit}>
      <h3>📋 Registration Form</h3>

      <div className="form-group">
        <label htmlFor="name">Tên:</label>
        <input
          id="name"
          type="text"
          name="name"
          placeholder="Nhập tên..."
          value={form.name}
          onChange={updateField}
          className={errors.name ? "input-error" : ""}
        />
        {errors.name && <span className="error-message">{errors.name}</span>}
      </div>

      {/* Email field */}
      <div className="form-group">
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          type="email"
          name="email"
          placeholder="Nhập email..."
          value={form.email}
          onChange={updateField}
          className={errors.email ? "input-error" : ""}
        />
        {errors.email && <span className="error-message">{errors.email}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="password">Mật khẩu:</label>
        <input
          id="password"
          type="password"
          name="password"
          placeholder="Nhập mật khẩu..."
          value={form.password}
          onChange={updateField}
          className={errors.password ? "input-error" : ""}
        />
        {errors.password && (
          <span className="error-message">{errors.password}</span>
        )}
      </div>

      <button type="submit" className="form-submit-btn">
        {submitted ? "Đang gửi..." : "Đăng ký"}
      </button>
    </form>
  );
}
