import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { getErrorMessage } from '../api/client.js';
import Button from '../components/ui/Button.jsx';

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
    <form className="flex max-w-md flex-col gap-3.5" onSubmit={handleSubmit}>
      <h2>Sign up</h2>
      <label className="flex flex-col gap-1.5 text-sm font-medium">Name<input name="name" value={form.name} onChange={update} required /></label>
      <label className="flex flex-col gap-1.5 text-sm font-medium">Email<input name="email" type="email" value={form.email} onChange={update} required /></label>
      <label className="flex flex-col gap-1.5 text-sm font-medium">Password<input name="password" type="password" value={form.password} onChange={update} required /></label>
      {error && <p className="text-sm text-danger">{error}</p>}
      <Button type="submit">Create account</Button>
      <p className="text-muted">Have an account? <Link to="/login">Login</Link></p>
    </form>
  );
}
