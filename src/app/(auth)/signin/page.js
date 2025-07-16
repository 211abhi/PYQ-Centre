"use client";

import { auth, provider } from "@/lib/firebaseClient";
import { signInWithPopup } from "firebase/auth";

export default function SignInPage() {
  const handleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("Signed in user:", result.user);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl mb-4">Sign in to Upload</h1>
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded"
        onClick={handleSignIn}
      >
        Sign in with Google
      </button>
    </main>
  );
}
