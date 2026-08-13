import { Component } from 'react';
import { Button } from '../ui/Button';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-950 p-4 text-gray-100">
          <div className="max-w-xl w-full text-center bg-gray-900 border border-gray-800 p-8 rounded-2xl space-y-4 shadow-2xl">
            <h1 className="text-2xl font-bold text-red-400">Application Error Caught</h1>
            <p className="text-sm text-gray-300 font-mono bg-gray-950 p-3 rounded-lg border border-red-900/50 text-left overflow-auto max-h-40">
              {this.state.error?.toString() || 'Unknown Error'}
            </p>
            {this.state.errorInfo?.componentStack && (
              <pre className="text-xs text-gray-500 bg-gray-950 p-3 rounded-lg text-left overflow-auto max-h-40 font-mono">
                {this.state.errorInfo.componentStack}
              </pre>
            )}
            <Button variant="primary" onClick={this.handleReset}>
              Reload Application
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
