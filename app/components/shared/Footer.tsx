import Link from "next/link";
import Image from "next/image";
import { Mail } from "lucide-react";
import { FaInstagram, FaTiktok } from "react-icons/fa";

const socialLinks = [
  {
    label: "Email",
    href: "mailto:yousafe.contact.inquire@gmail.com",
    icon: Mail,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/yousafe.routes",
    icon: FaInstagram,
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@yousafe926",
    icon: FaTiktok,
  },
];

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 mt-auto select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex flex-col items-start gap-3">
              <Image
                src="/logo.png"
                alt="YouSafe"
                width={160}
                height={48}
                className="h-12 w-auto invert brightness-0"
              />
              <p className="text-sm leading-relaxed">
                Helping wheelchair users find accessible places across Ireland.
              </p>
            </div>

            {/* Social */}
            <div className="flex items-center gap-3 pt-2">
              {socialLinks.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target={label !== "Email" ? "_blank" : undefined}
                  rel={label !== "Email" ? "noopener noreferrer" : undefined}
                  title={
                    label === "Email" ? "Email us" : `Follow us on ${label}`
                  }
                  className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-[#2B8FD4] flex items-center justify-center transition-colors"
                >
                  <Icon size={16} className="text-slate-400 hover:text-white" />
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div className="space-y-3">
            <h3 className="text-white font-semibold text-sm">Explore</h3>
            <ul className="space-y-2">
              {[
                { label: "Home", href: "/" },
                { label: "Locations", href: "/locations" },
                { label: "Map", href: "/map" },
                { label: "Blog", href: "/blog" },
                { label: "FAQ", href: "/faq" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-3">
            <h3 className="text-white font-semibold text-sm">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/privacy"
                  className="text-sm hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/cookies"
                  className="text-sm hover:text-white transition-colors"
                >
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <h3 className="text-white font-semibold text-sm">Contact</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="mailto:yousafe.contact.inquire@gmail.com"
                  className="text-sm hover:text-white transition-colors flex items-center gap-2"
                >
                  <Mail size={14} />
                  yousafe.contact.inquire@gmail.com
                </a>
              </li>

              <li>
                <a
                  href="https://www.instagram.com/yousafe.routes"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:text-white transition-colors flex items-center gap-2"
                >
                  <FaInstagram size={14} />
                  @yousafe.routes
                </a>
              </li>

              <li>
                <a
                  href="https://www.tiktok.com/@yousafe926"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:text-white transition-colors flex items-center gap-2"
                >
                  <FaTiktok size={14} />
                  @yousafe926
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-8 text-xs text-center">
          © {new Date().getFullYear()} YouSafe.ie. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
