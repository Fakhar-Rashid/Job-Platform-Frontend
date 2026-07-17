import type { ReactNode } from 'react';
import IconRail from './IconRail';
import Footer from './Footer';

interface AppShellProps {
  children: ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex min-h-screen">
      <IconRail />
      <div className="min-w-0 flex-1">
        <div className="mx-auto max-w-295 px-7 pt-7 pb-15">{children}</div>
        <Footer />
      </div>
    </div>
  );
}
