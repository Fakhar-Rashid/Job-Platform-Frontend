import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { avatarFor } from '../../utils/avatar.js';

export default function ProfileCard() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="side-card">
        <h4>Join MiniWork</h4>
        <p className="muted">Sign up to bid on jobs and hire freelancers.</p>
        <Link to="/register"><button style={{ width: '100%' }}>Create account</button></Link>
      </div>
    );
  }

  return (
    <div className="side-card">
      <div className="profile-head">
        <img src={avatarFor(user, 104)} alt="" />
        <div>
          <Link to="/profile" className="name">{user.name}</Link>
          <div className="title">{user.title || 'Add your professional title'}</div>
        </div>
      </div>

      <div className="side-row">
        <span className="label">Profile Visibility</span>
        <span className="link-green">Public</span>
      </div>

      <div style={{ paddingTop: 12 }}>
        <Link to="/profile" className="link-green">Complete your profile</Link>
        <div className="progress">
          <div className="bar"><div className="fill" style={{ width: '100%' }} /></div>
          <span className="muted">100%</span>
        </div>
      </div>
    </div>
  );
}
