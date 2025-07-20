"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function Header() {
  const [user, setUser] = useState(null);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check initial theme from localStorage only
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      const isDarkMode = savedTheme === 'dark';
      setIsDark(isDarkMode);
      
      // Apply the theme class immediately with explicit setup
      const html = document.documentElement;
      if (isDarkMode) {
        html.classList.remove('light');
        html.classList.add('dark');
        html.style.colorScheme = 'dark';
      } else {
        html.classList.remove('dark');
        html.classList.add('light');
        html.style.colorScheme = 'light';
      }
    }
  }, []);

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

  const toggleTheme = () => {
    const newIsDark = !isDark;
    
    // Update DOM immediately with force
    const html = document.documentElement;
    if (newIsDark) {
      html.classList.remove('light'); // Remove any light class
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      html.classList.remove('dark');
      html.classList.add('light'); // Explicitly add light class
      localStorage.setItem('theme', 'light');
    }
    
    // Force a re-render by updating state
    setIsDark(newIsDark);
    
    // Force CSS recalculation
    html.style.colorScheme = newIsDark ? 'dark' : 'light';
  };

  return (
    <header className="flex justify-between items-center p-3 md:p-4 lg:p-6 border-b border-gray-400 dark:border-gray-600 bg-yellow-100 dark:bg-gray-900 transition-colors duration-200 shadow-sm">
      <Link href="/" className="hover:opacity-80 transition-opacity">
        <Image
          src="/logo_light.png"
          alt="PYQ Centre Logo"
          width={240}
          height={240}
          priority
          quality={100}
          className="dark:hidden h-7 w-auto sm:h-8 md:h-10 lg:h-11"
        />
        <Image
          src="/logo_dark.png"
          alt="PYQ Centre Logo"
          width={240}
          height={240}
          priority
          quality={100}
          className="hidden dark:block h-7 w-auto sm:h-8 md:h-10 lg:h-11"
        />
      </Link>
      <nav className="flex items-center gap-2 sm:gap-3 md:gap-4">
        <Link href="/upload" className="px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm md:text-base rounded-md bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors font-medium">
          Upload
        </Link>
        <button
          onClick={toggleTheme}
          className="p-1.5 sm:p-2 rounded-lg border border-gray-500 dark:border-gray-500 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          aria-label="Toggle theme"
        >
          {isDark ? (
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
          )}
        </button>
        {user ? (
          <>
            <span className="text-xs sm:text-sm font-medium hidden sm:block">{user.email}</span>
            <button
              onClick={handleSignOut}
              className="px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-medium shadow-sm"
            >
              Sign Out
            </button>
          </>
        ) : (
          <button
            onClick={handleSignIn}
            className="px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors font-medium shadow-sm"
          >
            Sign In
          </button>
        )}
      </nav>
    </header>
  );
}
