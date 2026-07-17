import { Link } from 'react-router-dom';

const LINKS = ['About', 'Terms of Service', 'Privacy Policy', 'Accessibility', 'Help'];

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <nav className="footer-links">
        {LINKS.map((label) => (
          <Link key={label} to="/">{label}</Link>
        ))}
      </nav>
      <p className="footer-copy">© {year} MiniWork. All rights reserved.</p>
    </footer>
  );
}
