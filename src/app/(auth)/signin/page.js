"use client";

import { createBrowserClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";

export default function SignInPage() {
  const [supabase, setSupabase] = useState(null);

  useEffect(() => {
    const client = createBrowserClient();
    setSupabase(client);
  }, []);

  const handleSignIn = async () => {
    if (!supabase) return;
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
      });
      if (error) throw error;
    } catch (error) {
      console.error("Sign-in error:", error);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl mb-4">Sign in to Upload</h1>
      <button
        className="px-4 py-2 bg-green-600 text-white rounded"
        onClick={handleSignIn}
      >
        Sign in with Google (Supabase)
      </button>
    </main>
  );
}
