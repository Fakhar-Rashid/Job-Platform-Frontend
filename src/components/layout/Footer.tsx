import { Link } from 'react-router-dom';

const LINKS = ['About', 'Terms of Service', 'Privacy Policy', 'Accessibility', 'Help'];

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mx-auto max-w-295 border-t border-hair px-7 pt-5.5 pb-7.5 text-center">
      <nav className="mb-2 flex flex-wrap justify-center gap-5">
        {LINKS.map((label) => (
          <Link key={label} to="/" className="text-[13px] text-muted">
            {label}
          </Link>
        ))}
      </nav>
      <p className="m-0 text-xs text-muted">© {year} MiniWork. All rights reserved.</p>
    </footer>
  );
}
