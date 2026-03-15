"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

const COOKIE_NAME = "yousafe_cookie_consent";

export default function CookieBanner() {
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    const consent = Cookies.get(COOKIE_NAME);
    if (!consent) setVisible(true);
  }, []);

  const acceptAll = () => {
    Cookies.set(COOKIE_NAME, "accepted", { expires: 365 });
    setVisible(false);
  };

  const acceptNecessary = () => {
    Cookies.set(COOKIE_NAME, "necessary", { expires: 365 });
    setVisible(false);
  };

  const decline = () => {
    Cookies.set(COOKIE_NAME, "declined", { expires: 365 });
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-xl p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🍪</span>
            <h3 className="font-semibold text-slate-900 text-sm sm:text-base">
              We use cookies
            </h3>
          </div>
          <button
            onClick={decline}
            className="text-slate-400 hover:text-slate-600 transition-colors shrink-0"
          >
            <X size={18} />
          </button>
        </div>

        <p className="text-slate-500 text-sm leading-relaxed mb-5">
          We use cookies to improve your experience on YouSafe. Essential
          cookies are required for the site to function. We also use analytics
          cookies to understand how you use our site. You can choose which
          cookies to accept. For more information see our{" "}
          <a href="/privacy" className="text-[#2B8FD4] hover:underline">
            Privacy Policy
          </a>
          .
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={acceptAll}
            className="bg-[#2B8FD4] hover:bg-[#1a6fa8] text-white w-full sm:w-auto"
          >
            Accept All
          </Button>
          <Button
            onClick={acceptNecessary}
            variant="outline"
            className="w-full sm:w-auto"
          >
            Necessary Only
          </Button>
          <Button
            onClick={decline}
            variant="ghost"
            className="w-full sm:w-auto text-slate-500"
          >
            Decline
          </Button>
        </div>
      </div>
    </div>
  );
}
