import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { RefreshCw, Home, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorCount: number;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    errorCount: 0
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error);
    console.error('Component stack:', errorInfo.componentStack);
    
    this.setState(prevState => ({
      error,
      errorInfo,
      errorCount: prevState.errorCount + 1
    }));

    // Here you could send error reports to your error tracking service
    // Example: sendToErrorTracking(error, errorInfo);
  }

  private handleReload = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  private handleBack = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.history.back();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const isPersistentError = this.state.errorCount > 2;

      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <Alert variant="destructive" className="max-w-lg w-full">
            <AlertTitle className="text-lg font-semibold mb-2">
              {isPersistentError 
                ? "Persistent Error Detected" 
                : "Something went wrong"}
            </AlertTitle>
            <AlertDescription className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {this.state.error?.message || "An unexpected error occurred"}
              </p>
              {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
                <pre className="text-xs bg-secondary/50 p-2 rounded-md overflow-auto max-h-32">
                  {this.state.errorInfo.componentStack}
                </pre>
              )}
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant="outline"
                  onClick={this.handleReload}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reload page
                </Button>
                <Button
                  variant="outline"
                  onClick={this.handleBack}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Go back
                </Button>
                <Button
                  variant="outline"
                  asChild
                >
                  <Link to="/">
                    <Home className="mr-2 h-4 w-4" />
                    Return home
                  </Link>
                </Button>
              </div>
              {isPersistentError && (
                <p className="text-sm text-muted-foreground mt-4">
                  This error has occurred multiple times. If the problem persists,
                  please contact support or try clearing your browser cache.
                </p>
              )}
            </AlertDescription>
          </Alert>
        </div>
      );
    }

    return this.props.children;
  }
}