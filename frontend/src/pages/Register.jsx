import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  CheckSquare,
  User,
  Mail,
  Lock,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await register(form);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <CheckSquare size={30} />
        </div>

        <h1>Create Account</h1>

        <p className="auth-subtitle">
          Start organizing your work with TaskFlow.
        </p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <label>Full Name</label>

          <div className="input-wrapper">
            <User size={18} />
            <input
              name="name"
              placeholder="Your name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <label>Email Address</label>

          <div className="input-wrapper">
            <Mail size={18} />
            <input
              type="email"
              name="email"
              placeholder="Your email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <label>Password</label>

          <div className="input-wrapper">
            <Lock size={18} />
            <input
              type="password"
              name="password"
              placeholder="Minimum 6 characters"
              value={form.password}
              onChange={handleChange}
              minLength={6}
              required
            />
          </div>

          <button
            className="primary-btn full-btn"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account?{" "}
          <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;