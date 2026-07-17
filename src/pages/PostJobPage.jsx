import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button.jsx';
import { useCreateJob } from '../hooks/queries/useJobs.js';
import { getErrorMessage } from '../api/client.js';

export default function PostJobPage() {
  const navigate = useNavigate();
  const createJob = useCreateJob();
  const [form, setForm] = useState({ title: '', description: '', budget: '' });
  const [error, setError] = useState('');

  function update(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    try {
      const job = await createJob.mutateAsync(form);
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
      <Button type="submit" disabled={createJob.isPending}>{createJob.isPending ? 'Publishing…' : 'Publish job'}</Button>
    </form>
  );
}
