import type { Metadata } from "next";
import { Nunito, Nunito_Sans } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  weight: ["400", "500", "600", "700", "800"],
});

const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-nunito-sans",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "YouSafe — Wheelchair Accessible Places in Ireland",
    template: "%s | YouSafe",
  },
  description:
    "Find wheelchair friendly restaurants, hotels, transport, hospitals and more across Ireland. Navigate with confidence.",
  keywords: [
    "wheelchair accessible",
    "disability",
    "Ireland",
    "accessible places",
    "wheelchair friendly Dublin",
  ],
  authors: [{ name: "YouSafe" }],
  creator: "YouSafe",
  openGraph: {
    type: "website",
    locale: "en_IE",
    url: "https://yousafe.ie",
    siteName: "YouSafe",
    title: "YouSafe — Wheelchair Accessible Places in Ireland",
    description: "Find wheelchair friendly places across Ireland.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "YouSafe — Wheelchair Accessible Places in Ireland",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "YouSafe — Wheelchair Accessible Places in Ireland",
    description: "Find wheelchair friendly places across Ireland.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${nunito.variable} ${nunitoSans.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
