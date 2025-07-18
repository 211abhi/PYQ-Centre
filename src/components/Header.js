"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function Header() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({ provider: "google" });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <header className="flex justify-between items-center p-4 border-b">
      <Link href="/" className="text-xl font-bold">
        PYQ Centre
      </Link>
      <nav className="flex items-center gap-4">
        <Link href="/upload">Upload</Link>
        {user ? (
          <>
            <span>{user.email}</span>
            <button
              onClick={handleSignOut}
              className="px-2 py-1 bg-red-500 text-white rounded"
            >
              Sign Out
            </button>
          </>
        ) : (
          <button
            onClick={handleSignIn}
            className="px-2 py-1 bg-blue-500 text-white rounded"
          >
            Sign In
          </button>
        )}
      </nav>
    </header>
  );
}
