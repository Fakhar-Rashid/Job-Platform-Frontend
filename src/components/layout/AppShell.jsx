import IconRail from './IconRail.jsx';

export default function AppShell({ children }) {
  return (
    <div className="app">
      <IconRail />
      <div className="app-body">
        <div className="shell">{children}</div>
      </div>
    </div>
  );
}
