import { useState } from 'react';
import { X } from 'lucide-react';
import SectionCard from './SectionCard.jsx';
import * as profileApi from '../../api/profile.js';
import { getErrorMessage } from '../../api/client.js';

export default function SkillsSection({ profile, editable, onChanged }) {
  const [editing, setEditing] = useState(false);
  const [skills, setSkills] = useState(profile.skills);
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  function addSkill(event) {
    event.preventDefault();
    const next = value.trim();
    if (next && !skills.includes(next)) setSkills([...skills, next]);
    setValue('');
  }

  async function save() {
    setError('');
    try {
      await profileApi.updateSkills(skills);
      setEditing(false);
      onChanged();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  return (
    <SectionCard title="Skills" editable={editable} onEdit={editing ? undefined : () => setEditing(true)}>
      {editing ? (
        <>
          <div className="pills">
            {skills.map((skill) => (
              <span className="pill" key={skill}>
                {skill}
                <button className="pill-x" onClick={() => setSkills(skills.filter((s) => s !== skill))} aria-label={`Remove ${skill}`}>
                  <X size={13} />
                </button>
              </span>
            ))}
          </div>
          <form className="row" onSubmit={addSkill} style={{ marginTop: 12 }}>
            <input placeholder="Add a skill" value={value} onChange={(e) => setValue(e.target.value)} />
            <button type="submit" className="secondary">Add</button>
          </form>
          {error && <p className="error">{error}</p>}
          <div className="row" style={{ marginTop: 12 }}>
            <button onClick={save}>Save</button>
            <button className="secondary" onClick={() => { setSkills(profile.skills); setEditing(false); }}>Cancel</button>
          </div>
        </>
      ) : (
        <div className="pills">
          {skills.length === 0 ? <p className="muted">No skills added yet.</p>
            : skills.map((skill) => <span className="pill" key={skill}>{skill}</span>)}
        </div>
      )}
    </SectionCard>
  );
}
