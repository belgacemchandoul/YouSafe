import type { Metadata } from "next";
import { FadeIn } from "@/app/components/shared";
import { Shield, Eye, Cookie, UserCheck, Clock, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "YouSafe privacy policy and cookie information.",
};

const sections = [
  {
    icon: <Shield size={20} className="text-[#2B8FD4]" />,
    title: "1. Who We Are",
    content: (
      <p>
        YouSafe is a wheelchair accessibility platform for Ireland, helping
        users find accessible restaurants, hotels, transport, and other
        services. This privacy policy explains how we collect, use, and protect
        your personal data in compliance with the General Data Protection
        Regulation (GDPR).
      </p>
    ),
  },
  {
    icon: <Eye size={20} className="text-[#2B8FD4]" />,
    title: "2. Data We Collect",
    content: (
      <div className="space-y-3">
        <p>We collect the following types of data:</p>
        <ul className="space-y-2">
          {[
            "Usage data — pages visited, time spent on site",
            "Cookie preferences — your consent choices",
            "Device information — browser type, screen size",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2B8FD4] mt-2 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
        <p>
          We do not collect any personal identification information unless you
          contact us directly.
        </p>
      </div>
    ),
  },
  {
    icon: <Cookie size={20} className="text-[#2B8FD4]" />,
    title: "3. Cookies",
    content: (
      <div className="space-y-3">
        <p>We use the following types of cookies:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
          {[
            {
              name: "Essential Cookies",
              desc: "Required for the site to function correctly.",
              color: "bg-blue-50 text-blue-700",
            },
            {
              name: "Analytics Cookies",
              desc: "Help us understand how visitors use the site.",
              color: "bg-purple-50 text-purple-700",
            },
          ].map((cookie) => (
            <div
              key={cookie.name}
              className="p-4 bg-slate-50 rounded-xl border border-slate-100"
            >
              <span
                className={`text-xs font-semibold px-2 py-1 rounded-full ${cookie.color}`}
              >
                {cookie.name}
              </span>
              <p className="text-sm text-slate-600 mt-2">{cookie.desc}</p>
            </div>
          ))}
        </div>
        <p>
          You can manage your cookie preferences at any time through the cookie
          banner.
        </p>
      </div>
    ),
  },
  {
    icon: <UserCheck size={20} className="text-[#2B8FD4]" />,
    title: "4. Your Rights Under GDPR",
    content: (
      <div className="space-y-3">
        <p>Under GDPR you have the right to:</p>
        <ul className="space-y-2">
          {[
            "Access the personal data we hold about you",
            "Request correction of inaccurate data",
            "Request deletion of your data",
            "Withdraw consent at any time",
            "Lodge a complaint with the Data Protection Commission Ireland",
          ].map((right) => (
            <li key={right} className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5DBB3F] mt-2 shrink-0" />
              {right}
            </li>
          ))}
        </ul>
      </div>
    ),
  },
  {
    icon: <Clock size={20} className="text-[#2B8FD4]" />,
    title: "5. Data Retention",
    content: (
      <p>
        We retain cookie consent data for 365 days. After this period your
        preferences will be reset and you will be asked for consent again.
      </p>
    ),
  },
  {
    icon: <Mail size={20} className="text-[#2B8FD4]" />,
    title: "6. Contact",
    content: (
      <p>
        If you have any questions about this privacy policy or how we handle
        your data, please contact us at{" "}
        <a
          href="mailto:privacy@yousafe.ie"
          className="text-[#2B8FD4] hover:underline font-medium"
        >
          privacy@yousafe.ie
        </a>
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 sm:py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <FadeIn direction="up">
          <div className="text-center mb-10">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-4">
              <Shield size={28} className="text-[#2B8FD4]" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
              Privacy Policy
            </h1>
            <p className="text-slate-500 text-sm">Last updated: March 2026</p>
          </div>
        </FadeIn>

        {/* GDPR Badge */}
        <FadeIn direction="up" delay={0.1}>
          <div className="bg-[#2B8FD4]/5 border border-[#2B8FD4]/20 rounded-2xl p-4 mb-8 flex items-center gap-3">
            <Shield size={18} className="text-[#2B8FD4] shrink-0" />
            <p className="text-sm text-slate-600">
              This privacy policy is compliant with the{" "}
              <strong className="text-slate-900">
                General Data Protection Regulation (GDPR)
              </strong>{" "}
              and Irish data protection law.
            </p>
          </div>
        </FadeIn>

        {/* Sections */}
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
