import { Component } from "react";
import type { ReactNode, ErrorInfo } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Error Boundary Component
 * Catches JavaScript errors anywhere in the child component tree
 */
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error details to console
    console.error("ErrorBoundary caught an error:", error, errorInfo);

    // You can also log to an error reporting service here
    // logErrorToService(error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleGoHome = () => {
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-background-primary p-4">
          <Card className="max-w-2xl w-full">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-status-error/10 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-status-error" />
                </div>
                <CardTitle className="text-2xl">Something went wrong</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-text-secondary">
                We're sorry, but something unexpected happened. Our team has
                been notified and is working to fix the issue.
              </p>

              {/* Error details (only in development) */}
              {import.meta.env.DEV && this.state.error && (
                <div className="mt-4 p-4 bg-background-secondary rounded-lg overflow-auto">
                  <p className="text-sm font-semibold text-status-error mb-2">
                    Error Details (Development Only):
                  </p>
                  <pre className="text-xs text-text-secondary overflow-x-auto">
                    {this.state.error.toString()}
                  </pre>
                  {this.state.errorInfo && (
                    <details className="mt-2">
                      <summary className="text-xs text-text-secondary cursor-pointer hover:text-text-primary">
                        Component Stack
                      </summary>
                      <pre className="text-xs text-text-secondary mt-2 overflow-x-auto">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </details>
                  )}
                </div>
              )}

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <Button
                  onClick={this.handleReset}
                  className="flex-1 bg-brand-primary hover:bg-brand-primary/90"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
                <Button
                  onClick={this.handleGoHome}
                  variant="outline"
                  className="flex-1"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Go to Home
                </Button>
              </div>

              <p className="text-xs text-text-secondary text-center mt-4">
                If the problem persists, please contact support at{" "}
                <a
                  href="mailto:support@satyanvesh.com"
                  className="text-brand-secondary hover:underline"
                >
                  support@satyanvesh.com
                </a>
              </p>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
