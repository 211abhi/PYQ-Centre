"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function UploadForm() {
  const [file, setFile] = useState(null);
  const [university, setUniversity] = useState("");
  const [degree, setDegree] = useState("");
  const [year, setYear] = useState("");
  const [subject, setSubject] = useState("");
  const [status, setStatus] = useState("");

  // Get user session, only to show "Sign in" message
  const [user, setUser] = useState(null);
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      console.log("Client user ID:", user?.id);
    };
    getUser();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    //  only for signed-in users
    if (!user) {
      setStatus("❌ Please sign in first.");
      return;
    }

    if (!file) {
      setStatus("❌ Please select a PDF file.");
      return;
    }

    if (!file.name.endsWith(".pdf")) {
      setStatus("❌ Only PDF files are allowed.");
      return;
    }

    setStatus("⏳ Uploading...");

    try {
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("question-papers")
        .upload(`public/${Date.now()}-${file.name}`, file);

      if (uploadError) throw uploadError;

      
      const { data: publicURLData } = supabase.storage
        .from("question-papers")
        .getPublicUrl(uploadData.path);

      
      const { error: insertError } = await supabase.from("question_papers").insert({
        university,
        degree,
        year,
        subject,
        file_url: publicURLData.publicUrl,
        approved: false,
        uploader_id: user.id,  

      });

      if (insertError) throw insertError;

      setStatus("✅ Upload successful! Awaiting admin approval.");

      setFile(null);
      setUniversity("");
      setDegree("");
      setYear("");
      setSubject("");
    } catch (err) {
      console.error(err);
      setStatus(`❌ Upload failed: ${err.message}`);
    }
  };


  if (!user) {
    return <p className="text-center text-red-600">Please sign in to upload a question paper.</p>;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 max-w-md mx-auto p-4 border rounded shadow"
    >
      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files[0])}
        required
      />
      <input
        type="text"
        placeholder="University"
        value={university}
        onChange={(e) => setUniversity(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Degree"
        value={degree}
        onChange={(e) => setDegree(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Year"
        value={year}
        onChange={(e) => setYear(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Subject"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        required
      />
      <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">
        Upload PDF
      </button>
      {status && <p className="text-center">{status}</p>}
    </form>
  );
}
