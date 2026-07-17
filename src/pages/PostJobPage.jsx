import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as jobsApi from '../api/jobs.js';
import { getErrorMessage } from '../api/client.js';
import Button from '../components/ui/Button.jsx';

export default function PostJobPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', description: '', budget: '' });
  const [error, setError] = useState('');

  function update(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    try {
      const job = await jobsApi.createJob(form);
      navigate(`/jobs/${job.id}`);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  return (
    <form className="flex max-w-md flex-col gap-3.5" onSubmit={handleSubmit}>
      <h2>Post a job</h2>
      <label className="flex flex-col gap-1.5 text-sm font-medium">Title<input name="title" value={form.title} onChange={update} required /></label>
      <label className="flex flex-col gap-1.5 text-sm font-medium">Description<textarea name="description" rows="5" value={form.description} onChange={update} required /></label>
      <label className="flex flex-col gap-1.5 text-sm font-medium">Budget ($)<input name="budget" type="number" min="1" value={form.budget} onChange={update} required /></label>
      {error && <p className="text-sm text-danger">{error}</p>}
      <Button type="submit">Publish job</Button>
    </form>
  );
}
