import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/context/auth-context";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

const SITE_URL = "https://www.chetanpaudel.com.np";
const GITHUB_URL = "https://github.com/paudelchetan1112";
const FACEBOOK_URL = "https://www.facebook.com/chetan.paudel.2025";

const NAME = "Chetan Paudel";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${NAME} (Chetan) | Full Stack Developer`,
    template: `%s | ${NAME}`,
  },
  description:
    "Chetan Paudel (chetanpaudel) is a Full Stack Developer building web, mobile, and AI projects with React, Next.js and modern technologies. Explore his portfolio, GitHub and projects.",
  applicationName: `${NAME} Portfolio`,
  keywords: [
    "chetan",
    "chetan paudel",
    "chetanpaudel",
    "Chetan Paudel developer",
    "Chetan Paudel portfolio",
    "Chetan Paudel GitHub",
    "Chetan Paudel Facebook",
    "full stack developer",
    "web developer Nepal",
    "react",
    "next.js",
  ],
  authors: [{ name: NAME, url: SITE_URL }],
  creator: NAME,
  publisher: NAME,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    title: `${NAME} (Chetan) | Full Stack Developer`,
    description:
      "Portfolio of Chetan Paudel, a Full Stack Developer building modern web, mobile and AI projects.",
    siteName: `${NAME} Portfolio`,
    images: [
      {
        url: "/profilePhoto.jpg", // better: a 1200x630 image e.g. /og-image.png
        width: 1200,
        height: 630,
        alt: `${NAME} - Full Stack Developer`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${NAME} (Chetan) | Full Stack Developer`,
    description:
      "Portfolio of Chetan Paudel, a Full Stack Developer building modern web, mobile and AI projects.",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  
icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/logo.png", type: "image/png" },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
};

// Structured data: tells Google your website, GitHub and Facebook belong to the same person
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: NAME,
      alternateName: ["Chetan", "chetanpaudel", "Chetan Paudel"],
      url: SITE_URL,
      image: `${SITE_URL}/logo.png`,
      jobTitle: "Full Stack Developer",
      sameAs: [GITHUB_URL, FACEBOOK_URL],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: `${NAME} Portfolio`,
      alternateName: ["Chetan", "chetanpaudel"],
      inLanguage: "en",
      publisher: { "@id": `${SITE_URL}/#person` },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body
        className="font-sans antialiased bg-background text-foreground"
        suppressHydrationWarning
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>{children}</AuthProvider>
          <Toaster position="top-right" richColors />
        </ThemeProvider>
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  );
}