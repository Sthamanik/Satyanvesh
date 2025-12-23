import { AlertCircle, RefreshCw, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { AxiosError } from "axios";

interface ApiErrorFallbackProps {
  error?: AxiosError | Error | unknown;
  resetError?: () => void;
  showBackButton?: boolean;
  customMessage?: string;
}

/**
 * API Error Fallback Component
 * Shows user-friendly error messages for API failures
 */
export default function ApiErrorFallback({
  error,
  resetError,
  showBackButton = true,
  customMessage,
}: ApiErrorFallbackProps) {
  const navigate = useNavigate();

  // Determine error type and message
  const getErrorInfo = () => {
    if (!error) {
      return {
        title: "Something went wrong",
        message: "An unexpected error occurred. Please try again.",
        statusCode: null,
      };
    }

    // Check if it's an Axios error
    if (
      typeof error === "object" &&
      error !== null &&
      "isAxiosError" in error
    ) {
      const axiosError = error as AxiosError;
      const statusCode = axiosError.response?.status;

      switch (statusCode) {
        case 400:
          return {
            title: "Bad Request",
            message:
              "The request was invalid. Please check your input and try again.",
            statusCode,
          };
        case 401:
          return {
            title: "Unauthorized",
            message:
              "Your session has expired. Please log in again to continue.",
            statusCode,
          };
        case 403:
          return {
            title: "Access Denied",
            message: "You don't have permission to access this resource.",
            statusCode,
          };
        case 404:
          return {
            title: "Not Found",
            message:
              "The requested resource could not be found. It may have been moved or deleted.",
            statusCode,
          };
        case 429:
          return {
            title: "Too Many Requests",
            message:
              "You have made too many requests. Please wait a moment and try again.",
            statusCode,
          };
        case 500:
          return {
            title: "Server Error",
            message:
              "Our server encountered an error. Our team has been notified.",
            statusCode,
          };
        case 503:
          return {
            title: "Service Unavailable",
            message:
              "The service is temporarily unavailable. Please try again later.",
            statusCode,
          };
        default:
          if (!statusCode) {
            return {
              title: "Connection Error",
              message:
                "Unable to connect to the server. Please check your internet connection.",
              statusCode: null,
            };
          }
          return {
            title: `Error ${statusCode}`,
            message:
              "An unexpected error occurred. Please try again or contact support.",
            statusCode,
          };
      }
    }

    // Generic error
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return {
      title: "Error",
      message: errorMessage,
      statusCode: null,
    };
  };

  const errorInfo = getErrorInfo();
  const displayMessage = customMessage || errorInfo.message;

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex items-center justify-center min-h-100 p-4">
      <Card className="max-w-md w-full">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            {/* Error Icon */}
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-status-error/10 flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-status-error" />
              </div>
            </div>

            {/* Error Title */}
            <div>
              <h3 className="text-xl font-semibold text-text-primary mb-2">
                {errorInfo.title}
              </h3>
              {errorInfo.statusCode && (
                <p className="text-sm text-text-secondary">
                  Error Code: {errorInfo.statusCode}
                </p>
              )}
            </div>

            {/* Error Message */}
            <p className="text-text-secondary">{displayMessage}</p>

            {/* Development Mode - Show detailed error */}
            {import.meta.env.DEV && error instanceof Error && (
              <details className="text-left">
                <summary className="text-xs text-text-secondary cursor-pointer hover:text-text-primary">
                  Technical Details (Dev Only)
                </summary>
                <pre className="text-xs text-text-secondary mt-2 p-2 bg-background-secondary rounded overflow-x-auto">
                  {error.stack || error.message}
                </pre>
              </details>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 pt-4">
              {resetError && (
                <Button
                  onClick={resetError}
                  className="flex-1 bg-brand-primary hover:bg-brand-primary/90"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
              )}
              {showBackButton && (
                <Button
                  onClick={handleGoBack}
                  variant="outline"
                  className="flex-1"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Go Back
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
