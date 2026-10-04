import { Component, type PropsWithChildren } from 'react';
import { ErrorState, Screen } from '@/design-system/primitives';
import { reportError } from '@/services/telemetry';

export class AppErrorBoundary extends Component<PropsWithChildren, { failed: boolean }> {
  override state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  override componentDidCatch(error: Error) { reportError(error); }
  override render() {
    if (this.state.failed) return <Screen><ErrorState
      description="LUNQRA couldn’t load this screen. Try again."
      onRetry={() => this.setState({ failed: false })} /></Screen>;
    return this.props.children;
  }
}
