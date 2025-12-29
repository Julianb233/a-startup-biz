"use client";

import * as Sentry from "@sentry/nextjs";

export default function SentryExamplePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Sentry Error Testing
        </h1>
        <p className="text-gray-600 mb-6">
          Click the buttons below to trigger test errors and verify Sentry is
          working correctly.
        </p>
        <div className="space-y-4">
          <button
            type="button"
            className="w-full px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
            onClick={() => {
              throw new Error("Sentry Frontend Error Test");
            }}
          >
            Throw Frontend Error
          </button>

          <button
            type="button"
            className="w-full px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
            onClick={async () => {
              await fetch("/api/sentry-example-api");
            }}
          >
            Trigger API Error
          </button>

          <button
            type="button"
            className="w-full px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            onClick={() => {
              Sentry.captureMessage("Sentry Manual Message Test");
              alert("Message sent to Sentry!");
            }}
          >
            Send Test Message
          </button>
        </div>
        <p className="text-sm text-gray-500 mt-6">
          Check your Sentry dashboard to see the captured errors.
        </p>
      </div>
    </div>
  );
}
