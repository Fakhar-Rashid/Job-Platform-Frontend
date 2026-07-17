import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { getErrorMessage } from '../api/client.js';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  function update(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    try {
      await login(form);
      navigate('/');
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  return (
    <form className="stack" onSubmit={handleSubmit}>
      <h2>Login</h2>
      <label>Email<input name="email" type="email" value={form.email} onChange={update} required /></label>
      <label>Password<input name="password" type="password" value={form.password} onChange={update} required /></label>
      {error && <p className="error">{error}</p>}
      <button type="submit">Login</button>
      <p className="muted">No account? <Link to="/register">Sign up</Link></p>
    </form>
  );
}
