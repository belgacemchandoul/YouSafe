import type { Metadata } from "next";
import { FadeIn } from "@/app/components/shared";
import {
  HelpCircle,
  Shield,
  Lock,
  Trash2,
  Mail,
  CheckCircle,
  Globe,
  User,
} from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Frequently asked questions about YouSafe — how we handle your data, privacy, and accessibility.",
};

const faqs = [
  {
    icon: <Globe size={20} className="text-[#2B8FD4]" />,
    question: "What data does YouSafe collect?",
    answer:
      "YouSafe only collects anonymous location browsing data when you use the map and locations features. No personal information is required to use the site. You do not need to create an account or provide any details to access any part of the platform.",
  },
  {
    icon: <Lock size={20} className="text-[#2B8FD4]" />,
    question: "Is my data stored or sold?",
    answer:
      "No. YouSafe does not store or sell any user data to third parties. We do not use your browsing activity for advertising or share it with any external organisations. The only data stored is your cookie consent preference, which is kept locally on your device.",
  },
  {
    icon: <User size={20} className="text-[#2B8FD4]" />,
    question: "Who can see my activity on the site?",
    answer:
      "Only the YouSafe admin can access backend data for platform management purposes. Your browsing is completely anonymous and is not visible to other users of the platform.",
  },
  {
    icon: <Shield size={20} className="text-[#2B8FD4]" />,
    question: "How long is my data kept?",
    answer:
      "Your cookie consent preference is stored for 365 days, after which you will be asked again. No other personal data is retained. If you request deletion of any data we hold, it will be removed promptly.",
  },
  {
    icon: <Trash2 size={20} className="text-[#2B8FD4]" />,
    question: "How do I request my data to be deleted?",
    answer:
      "You can request deletion of any data we hold by emailing us at yousafe.contact.inquire@gmail.com. We will action your request within 30 days as required under GDPR Article 17 — the right to erasure.",
  },
  {
    icon: <CheckCircle size={20} className="text-[#2B8FD4]" />,
    question: "Is YouSafe GDPR compliant?",
    answer:
      "Yes. YouSafe is fully compliant with the General Data Protection Regulation (GDPR) and the European Accessibility Act 2025. We have a Privacy Policy, Cookie Policy, and cookie consent banner in place. We are registered as an Irish business operating under Irish and EU law.",
  },
  {
    icon: <Shield size={20} className="text-[#2B8FD4]" />,
    question: "Is my data encrypted?",
    answer:
      "Yes. All data transmitted through YouSafe is encrypted using HTTPS and SSL. This means any information exchanged between your browser and our platform is fully secured and cannot be intercepted.",
  },
  {
    icon: <HelpCircle size={20} className="text-[#2B8FD4]" />,
    question: "Who operates YouSafe?",
    answer:
      "YouSafe is operated as a registered Irish business. The platform is managed by the YouSafe team based in Ireland and is dedicated to helping wheelchair users and people with mobility needs find accessible places across the country.",
  },
];

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 sm:py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <FadeIn direction="up">
          <div className="text-center mb-10">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-4">
              <HelpCircle size={28} className="text-[#2B8FD4]" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
              Frequently Asked Questions
            </h1>
            <p className="text-slate-500 text-sm">
              Everything you need to know about YouSafe, your data, and your
              privacy.
            </p>
          </div>
        </FadeIn>

        {/* GDPR Badge */}
        <FadeIn direction="up" delay={0.1}>
          <div className="bg-[#2B8FD4]/5 border border-[#2B8FD4]/20 rounded-2xl p-4 mb-8 flex items-center gap-3">
            <Shield size={18} className="text-[#2B8FD4] shrink-0" />
            <p className="text-sm text-slate-600">
              YouSafe is fully compliant with{" "}
              <strong className="text-slate-900">GDPR</strong> and the{" "}
              <strong className="text-slate-900">
                European Accessibility Act 2025
              </strong>
              . Your privacy is our priority.
            </p>
          </div>
        </FadeIn>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <FadeIn key={faq.question} direction="up" delay={index * 0.05}>
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                    {faq.icon}
                  </div>
                  <h2 className="text-base sm:text-lg font-semibold text-slate-900">
                    {faq.question}
                  </h2>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed pl-12">
                  {faq.answer}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* Contact CTA */}
        <FadeIn direction="up" delay={0.5}>
          <div className="mt-8 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 text-center">
            <Mail size={24} className="text-[#2B8FD4] mx-auto mb-3" />
            <h2 className="text-lg font-semibold text-slate-900 mb-2">
              Still have questions?
            </h2>
            <p className="text-slate-500 text-sm mb-4">
              We are happy to help. Reach out to us directly and we will get
              back to you.
            </p>
            <a
              href="mailto:yousafe.contact.inquire@gmail.com"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg
                bg-[#2B8FD4] text-white text-sm font-medium hover:bg-[#1a6fa8]
                transition-colors select-auto"
            >
              <Mail size={16} />
              yousafe.contact.inquire@gmail.com
            </a>
          </div>
        </FadeIn>

        {/* Links */}
        <FadeIn direction="up" delay={0.6}>
          <div className="mt-6 flex items-center justify-center gap-6 text-sm text-slate-400">
            <Link
              href="/privacy"
              className="hover:text-[#2B8FD4] transition-colors"
            >
              Privacy Policy
            </Link>
            <span>·</span>
            <Link
              href="/cookies"
              className="hover:text-[#2B8FD4] transition-colors"
            >
              Cookie Policy
            </Link>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
