// src/pages/Register.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await register(form.name.trim(), form.email.trim(), form.password);
      navigate("/notes");
    } catch (err) {
      setError(err?.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div className="container" style={{ maxWidth: 480 }}>
      <h2 className="mb-3">Register</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={onSubmit} className="vstack gap-3">
        <input className="form-control" name="name" placeholder="Name" value={form.name} onChange={onChange} required />
        <input className="form-control" name="email" type="email" placeholder="Email" value={form.email} onChange={onChange} required />
        <input className="form-control" name="password" type="password" placeholder="Password" value={form.password} onChange={onChange} required />
        <button className="btn btn-primary" type="submit">Create account</button>
      </form>
      <p className="mt-3">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}
