import Link from "next/link";
import Image from "next/image";
import { Mail } from "lucide-react";

const InstagramIcon = ({ size = 16, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="currentColor"
    className={className}
  >
    <path d="M7.75 2C4.574 2 2 4.574 2 7.75v8.5C2 19.426 4.574 22 7.75 22h8.5C19.426 22 22 19.426 22 16.25v-8.5C22 4.574 19.426 2 16.25 2h-8.5zm0 2h8.5C18.545 4 20 5.455 20 7.75v8.5C20 18.545 18.545 20 16.25 20h-8.5C5.455 20 4 18.545 4 16.25v-8.5C4 5.455 5.455 4 7.75 4zm8.25 1a1 1 0 100 2 1 1 0 000-2zM12 7a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6z" />
  </svg>
);

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4 lg:col-span-1">
            <div className="flex flex-col items-start gap-3">
              <Image
                src="/logo.png"
                alt="YouSafe"
                width={160}
                height={48}
                className="h-12 w-auto"
              />
              <p className="text-sm leading-relaxed">
                Helping wheelchair users find accessible places across Ireland.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="mailto:yousafe.contact.inquire@gmail.com"
                className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-[#2B8FD4] flex items-center justify-center transition-colors"
                title="Email us"
              >
                <Mail size={16} className="text-slate-400 hover:text-white" />
              </a>

              <a
                href="https://www.instagram.com/yousafe.routes"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-[#2B8FD4] flex items-center justify-center transition-colors"
                title="Follow us on Instagram"
              >
                <InstagramIcon className="text-slate-400 hover:text-white" />
              </a>
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
                  <InstagramIcon size={14} />
                  @yousafe.routes
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-8 text-xs text-center">
          © {new Date().getFullYear()} YouSafe. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
