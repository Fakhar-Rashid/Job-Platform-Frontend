import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('Uncaught render error:', error, info);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="mx-auto max-w-md p-10 text-center">
          <h1 className="mb-2 text-xl font-semibold">Something went wrong</h1>
          <p className="mb-5 text-muted">An unexpected error occurred. Reloading usually fixes it.</p>
          <button
            className="rounded-full bg-brand px-4 py-2 font-semibold text-white hover:bg-brand-dark"
            onClick={() => window.location.reload()}
          >
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
