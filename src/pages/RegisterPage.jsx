import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { getErrorMessage } from '../api/client.js';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  function update(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    try {
      await register(form);
      navigate('/');
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  return (
    <form className="stack" onSubmit={handleSubmit}>
      <h2>Sign up</h2>
      <label>Name<input name="name" value={form.name} onChange={update} required /></label>
      <label>Email<input name="email" type="email" value={form.email} onChange={update} required /></label>
      <label>Password<input name="password" type="password" value={form.password} onChange={update} required /></label>
      {error && <p className="error">{error}</p>}
      <button type="submit">Create account</button>
      <p className="muted">Have an account? <Link to="/login">Login</Link></p>
    </form>
  );
}
