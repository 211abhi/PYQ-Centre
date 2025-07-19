import "./globals.css";
import Header from "@/components/Header";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export const metadata = {
  title: "PYQ Centre",
};

export default async function RootLayout({ children }) {
  const supabase = createServerComponentClient({ cookies }); 
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html lang="en">
      <body className="bg-black text-white">
        <Header user={user} />
        {children}
      </body>
    </html>
  );
}
