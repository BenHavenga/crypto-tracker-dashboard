import "./globals.css";

export const metadata = {
  title: "Crypto Tracker Dashboard",
  description:
    "A sleek, real-time cryptocurrency dashboard built with Next.js, TailwindCSS, and Recharts. Powered by CoinGecko API.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="min-h-screen bg-neutral-100 text-neutral-900 dark:bg-neutral-950 dark:text-white transition-colors">
        {children}
      </body>
    </html>
  );
}
