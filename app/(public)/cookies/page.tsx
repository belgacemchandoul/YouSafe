import type { Metadata } from "next";
import { FadeIn } from "@/app/components/shared";
import { Cookie, Shield, Settings, BarChart3, Info } from "lucide-react";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "YouSafe cookie policy — how we use cookies and how to manage them.",
};

const sections = [
  {
    icon: <Info size={20} className="text-[#2B8FD4]" />,
    title: "1. What Are Cookies",
    content: (
      <p>
        Cookies are small text files that are placed on your device when you
        visit a website. They are widely used to make websites work more
        efficiently and to provide information to the owners of the site.
        Cookies do not contain any personally identifiable information.
      </p>
    ),
  },
  {
    icon: <Cookie size={20} className="text-[#2B8FD4]" />,
    title: "2. How We Use Cookies",
    content: (
      <p>
        YouSafe uses cookies to improve your browsing experience, remember your
        preferences, and understand how visitors use our site. We do not use
        cookies for advertising or to track you across other websites.
      </p>
    ),
  },
  {
    icon: <Shield size={20} className="text-[#2B8FD4]" />,
    title: "3. Essential Cookies",
    content: (
      <div className="space-y-3">
        <p>
          These cookies are necessary for the website to function and cannot be
          switched off. They are usually set in response to actions you take
          such as setting your privacy preferences or logging in.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-slate-200 rounded-xl overflow-hidden">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left p-3 font-semibold text-slate-700">
                  Cookie Name
                </th>
                <th className="text-left p-3 font-semibold text-slate-700">
                  Purpose
                </th>
                <th className="text-left p-3 font-semibold text-slate-700">
                  Duration
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-slate-200">
                <td className="p-3 text-slate-600 font-mono text-xs">
                  yousafe_cookie_consent
                </td>
                <td className="p-3 text-slate-600">
                  Stores your cookie consent preference
                </td>
                <td className="p-3 text-slate-600">365 days</td>
              </tr>
              <tr className="border-t border-slate-200">
                <td className="p-3 text-slate-600 font-mono text-xs">
                  next-auth.session-token
                </td>
                <td className="p-3 text-slate-600">
                  Keeps admin users authenticated
                </td>
                <td className="p-3 text-slate-600">Session</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    ),
  },
  {
    icon: <BarChart3 size={20} className="text-[#2B8FD4]" />,
    title: "4. Analytics Cookies",
    content: (
      <div className="space-y-3">
        <p>
          These cookies help us understand how visitors interact with our
          website by collecting and reporting information anonymously. This
          helps us improve the site experience for all users.
        </p>
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
          <p className="text-sm text-slate-600">
            Analytics cookies are only set if you click{" "}
            <strong>Accept All</strong> on our cookie banner. If you choose{" "}
            <strong>Necessary Only</strong> or <strong>Decline</strong>, no
            analytics cookies will be placed.
          </p>
        </div>
      </div>
    ),
  },
  {
    icon: <Settings size={20} className="text-[#2B8FD4]" />,
    title: "5. Managing Your Cookies",
    content: (
      <div className="space-y-3">
        <p>You can control and manage cookies in several ways:</p>

        <ul className="space-y-2">
          {[
            "Use our cookie banner to accept or decline non-essential cookies",
            "Clear cookies through your browser settings at any time",
            "Set your browser to block cookies — note that this may affect site functionality",
            "Use private/incognito browsing mode to prevent cookies being stored",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2B8FD4] mt-2 shrink-0" />
              {item}
            </li>
          ))}
        </ul>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
          {[
            {
              browser: "Google Chrome",
              href: "https://support.google.com/chrome/answer/95647",
            },
            {
              browser: "Mozilla Firefox",
              href: "https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer",
            },
            {
              browser: "Safari",
              href: "https://support.apple.com/en-gb/guide/safari/sfri11471/mac",
            },
            {
              browser: "Microsoft Edge",
              href: "https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09",
            },
          ].map((item) => (
            <a
              key={item.browser}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-sm text-[#2B8FD4] hover:bg-blue-50 transition-colors"
            >
              {item.browser} →
            </a>
          ))}
        </div>
      </div>
    ),
  },
  {
    icon: <Shield size={20} className="text-[#2B8FD4]" />,
    title: "6. Third Party Cookies",
    content: (
      <div className="space-y-3">
        <p>
          Some pages on YouSafe embed content from third party services which
          may set their own cookies:
        </p>
        <ul className="space-y-2">
          {[
            "OpenStreetMap — used for location maps on individual location pages",
            "YouTube — used for embedded videos on the homepage and media page",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
        <p>
          These third party cookies are governed by the respective privacy
          policies of those services. We have no control over them.
        </p>
      </div>
    ),
  },
  {
    icon: <Info size={20} className="text-[#2B8FD4]" />,
    title: "7. Changes to This Policy",
    content: (
      <p>
        We may update this cookie policy from time to time. Any changes will be
        posted on this page with an updated revision date. We encourage you to
        review this policy periodically.
      </p>
    ),
  },
  {
    icon: <Cookie size={20} className="text-[#2B8FD4]" />,
    title: "8. Contact",
    content: (
      <p>
        If you have any questions about our use of cookies, please contact us at{" "}
        <a
          href="mailto:yousafe.contact.inquire@gmail.com"
          className="text-[#2B8FD4] hover:underline font-medium"
        >
          yousafe.contact.inquire@gmail.com
        </a>
      </p>
    ),
  },
];

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 sm:py-16 select-none">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn direction="up">
          <div className="text-center mb-10">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-4">
              <Cookie size={28} className="text-[#2B8FD4]" />
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
              Cookie Policy
            </h1>

            <p className="text-slate-500 text-sm">Last updated: March 2026</p>
          </div>
        </FadeIn>

        <FadeIn direction="up" delay={0.1}>
          <div className="bg-[#2B8FD4]/5 border border-[#2B8FD4]/20 rounded-2xl p-4 mb-8 flex items-center gap-3">
            <Cookie size={18} className="text-[#2B8FD4] shrink-0" />
            <p className="text-sm text-slate-600">
              This policy explains how YouSafe uses cookies and similar
              technologies in accordance with{" "}
              <strong className="text-slate-900">EU Cookie Law</strong> and the{" "}
              <strong className="text-slate-900">GDPR</strong>.
            </p>
          </div>
        </FadeIn>

        <div className="space-y-4">
          {sections.map((section, index) => (
            <FadeIn key={section.title} direction="up" delay={index * 0.05}>
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                    {section.icon}
                  </div>
                  <h2 className="text-base sm:text-lg font-semibold text-slate-900">
                    {section.title}
                  </h2>
                </div>

                <div className="text-slate-600 text-sm leading-relaxed pl-12">
                  {section.content}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </div>
  );
}
