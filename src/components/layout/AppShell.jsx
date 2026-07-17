import IconRail from './IconRail.jsx';
import Footer from './Footer.jsx';

export default function AppShell({ children }) {
  return (
    <div className="app">
      <IconRail />
      <div className="app-body">
        <div className="shell">{children}</div>
        <Footer />
      </div>
    </div>
  );
}
