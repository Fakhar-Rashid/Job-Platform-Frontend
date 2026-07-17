import type { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import IconRail from './IconRail';
import Footer from './Footer';

interface AppShellProps {
  children: ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const { pathname } = useLocation();
  const bare = pathname.startsWith('/messages');

  return (
    <div className="flex min-h-screen">
      <IconRail />
      {bare ? (
        <div className="h-screen min-w-0 flex-1">{children}</div>
      ) : (
        <div className="min-w-0 flex-1">
          <div className="mx-auto max-w-295 px-7 pt-7 pb-15">{children}</div>
          <Footer />
        </div>
      )}
    </div>
  );
}
