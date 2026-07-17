import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getErrorMessage } from '../api/client';
import Button from '../components/ui/Button';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  function update(event: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event: React.FormEvent) {
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
    <form className="flex max-w-md flex-col gap-3.5" onSubmit={handleSubmit}>
      <h2>Login</h2>
      <label className="flex flex-col gap-1.5 text-sm font-medium">Email<input name="email" type="email" value={form.email} onChange={update} required /></label>
      <label className="flex flex-col gap-1.5 text-sm font-medium">Password<input name="password" type="password" value={form.password} onChange={update} required /></label>
      {error && <p className="text-sm text-danger">{error}</p>}
      <Button type="submit">Login</Button>
      <p className="text-muted">No account? <Link to="/register">Sign up</Link></p>
    </form>
  );
}
