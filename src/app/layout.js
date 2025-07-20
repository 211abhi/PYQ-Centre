import "./globals.css";
import Header from "@/components/Header";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export const metadata = {
  title: "PYQ Centre",
  icons: {
    icon: [
      {
        url: "/favicon_io_light/favicon.ico",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/favicon_io_dark/favicon.ico",
        media: "(prefers-color-scheme: dark)",
      },
    ],
    apple: [
      {
        url: "/favicon_io_light/apple-touch-icon.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/favicon_io_dark/apple-touch-icon.png",
        media: "(prefers-color-scheme: dark)",
      },
    ],
  },
};

export default async function RootLayout({ children }) {
  const supabase = createServerComponentClient({ cookies }); 
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const theme = localStorage.getItem('theme');
                const html = document.documentElement;
                
                if (theme === 'dark') {
                  html.classList.remove('light');
                  html.classList.add('dark');
                  html.style.colorScheme = 'dark';
                } else {
                  html.classList.remove('dark');
                  html.classList.add('light');
                  html.style.colorScheme = 'light';
                }

                })();
            `,
          }}
        />
        <link 
          rel="icon" 
          href="/favicon_io_light/favicon.ico" 
          media="(prefers-color-scheme: light)" 
        />
        <link 
          rel="icon" 
          href="/favicon_io_dark/favicon.ico" 
          media="(prefers-color-scheme: dark)" 
        />
        <link 
          rel="apple-touch-icon" 
          href="/favicon_io_light/apple-touch-icon.png" 
          media="(prefers-color-scheme: light)" 
        />
        <link 
          rel="apple-touch-icon" 
          href="/favicon_io_dark/apple-touch-icon.png" 
          media="(prefers-color-scheme: dark)" 
        />
      </head>
      <body className="bg-yellow-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors duration-200 min-h-screen">
        <Header user={user} />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </main>
      </body>
    </html>
  );
}
