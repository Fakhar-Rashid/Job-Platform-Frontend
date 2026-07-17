import { useState } from 'react';
import { X } from 'lucide-react';
import SectionCard from './SectionCard.jsx';
import Button from '../ui/Button.jsx';
import Pill from '../ui/Pill.jsx';
import { useUpdateSkills } from '../../hooks/queries/useProfile.js';
import { getErrorMessage } from '../../api/client.js';

export default function SkillsSection({ profile, editable }) {
  const [editing, setEditing] = useState(false);
  const [skills, setSkills] = useState(profile.skills);
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const updateSkills = useUpdateSkills();

  function addSkill(event) {
    event.preventDefault();
    const next = value.trim();
    if (next && !skills.includes(next)) setSkills([...skills, next]);
    setValue('');
  }

  async function save() {
    setError('');
    try {
      await updateSkills.mutateAsync(skills);
      setEditing(false);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  return (
    <SectionCard title="Skills" editable={editable} onEdit={editing ? undefined : () => setEditing(true)}>
      {editing ? (
        <>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <Pill key={skill}>
                {skill}
                <button className="inline-flex cursor-pointer border-none bg-transparent pl-1 text-inherit" onClick={() => setSkills(skills.filter((s) => s !== skill))} aria-label={`Remove ${skill}`}>
                  <X size={13} />
                </button>
              </Pill>
            ))}
          </div>
          <form className="mt-3 flex items-center gap-3" onSubmit={addSkill}>
            <input placeholder="Add a skill" value={value} onChange={(e) => setValue(e.target.value)} />
            <Button type="submit" variant="secondary">Add</Button>
          </form>
          {error && <p className="text-danger text-sm">{error}</p>}
          <div className="mt-3 flex items-center gap-3">
            <Button onClick={save}>Save</Button>
            <Button variant="secondary" onClick={() => { setSkills(profile.skills); setEditing(false); }}>Cancel</Button>
          </div>
        </>
      ) : (
        <div className="flex flex-wrap gap-2">
          {skills.length === 0 ? <p className="text-muted">No skills added yet.</p>
            : skills.map((skill) => <Pill key={skill}>{skill}</Pill>)}
        </div>
      )}
    </SectionCard>
  );
}
