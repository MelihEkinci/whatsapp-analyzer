import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ error, errorInfo });
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-slate-900 text-white p-8 flex flex-col items-center justify-center">
                    <div className="bg-red-900/20 border border-red-500/50 p-6 rounded-2xl max-w-2xl w-full">
                        <h1 className="text-2xl font-bold text-red-400 mb-4">Something went wrong.</h1>
                        <p className="text-slate-300 mb-4">The application crashed. Here is the error:</p>
                        <pre className="bg-black/50 p-4 rounded-lg text-red-300 overflow-auto text-sm font-mono mb-4">
                            {this.state.error && this.state.error.toString()}
                        </pre>
                        <details className="text-slate-400 text-xs">
                            <summary className="cursor-pointer mb-2">Stack Trace</summary>
                            <pre className="whitespace-pre-wrap">
                                {this.state.errorInfo && this.state.errorInfo.componentStack}
                            </pre>
                        </details>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-6 px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-colors"
                        >
                            Reload Page
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
