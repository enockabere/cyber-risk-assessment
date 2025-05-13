"use client";

import { MailCheck, Info } from "lucide-react";

export default function VerifyRequest() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-md w-full bg-white shadow-md rounded-lg p-6 text-center border border-gray-100">
        <div className="flex flex-col items-center">
          <div className="bg-indigo-100 text-indigo-600 rounded-full p-3 mb-4">
            <MailCheck className="w-6 h-6" />
          </div>

          <h1 className="text-2xl font-semibold text-gray-800 mb-2">
            Check your inbox
          </h1>
          <p className="text-sm text-gray-600 mb-4">
            We've sent a <strong>secure sign-in link</strong> to your email.
            Click the link to log in to your account.
          </p>

          <div className="text-left text-xs text-gray-500 bg-gray-50 p-3 rounded-md border border-gray-200">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 mt-0.5 text-indigo-400" />
              <span>
                <strong>Didn’t receive the email?</strong>
                <br />
                • Check your spam or promotions folder
                <br />
                • Make sure you entered the correct email
                <br />• Still nothing? Try again after 60 seconds
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
