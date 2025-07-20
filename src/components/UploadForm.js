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
    return (
      <div className="min-h-screen flex items-center justify-center bg-yellow-50 dark:bg-gray-800 px-4">
        <div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 text-center max-w-md w-full">
          <div className="mb-6">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Authentication Required</h2>
            <p className="text-gray-600 dark:text-gray-400">Please sign in to upload question papers</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-yellow-50 dark:bg-gray-800 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Upload Question Paper</h1>
          <p className="text-gray-600 dark:text-gray-400">Share your question papers to help fellow students</p>
        </div>

        {/* Upload Form Card */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* File Upload Section */}
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-blue-400 dark:hover:border-blue-500 transition-colors">
                <div className="mb-4">
                  <svg className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setFile(e.target.files[0])}
                  required
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <span className="text-blue-600 dark:text-blue-400 font-medium hover:text-blue-500">Upload a PDF file</span>
                  <span className="text-gray-500 dark:text-gray-400"> or drag and drop</span>
                </label>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">PDF files only, up to 10MB</p>
                {file && (
                  <div className="mt-3 p-2 bg-green-50 dark:bg-green-900 rounded text-green-700 dark:text-green-300 text-sm">
                    ✓ {file.name}
                  </div>
                )}
              </div>

              {/* Form Fields Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">University</label>
                  <input
                    type="text"
                    placeholder="e.g., Tribhuvan University"
                    value={university}
                    onChange={(e) => setUniversity(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Degree</label>
                  <input
                    type="text"
                    placeholder="e.g., Bachelor of Engineering"
                    value={degree}
                    onChange={(e) => setDegree(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Year</label>
                  <input
                    type="text"
                    placeholder="e.g., 2023"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Subject</label>
                  <input
                    type="text"
                    placeholder="e.g., Data Structures"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Upload Question Paper
                </button>
              </div>

              {/* Status Message */}
              {status && (
                <div className={`p-4 rounded-lg text-center font-medium ${
                  status.includes('✅') 
                    ? 'bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-700' 
                    : status.includes('❌') 
                    ? 'bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-700'
                    : 'bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700'
                }`}>
                  {status}
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900 rounded-lg p-6 border border-blue-200 dark:border-blue-700">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">Upload Guidelines</h3>
          <ul className="text-blue-800 dark:text-blue-200 space-y-1 text-sm">
            <li>• Only PDF files are accepted</li>
            <li>• Files will be reviewed before being made public</li>
            <li>• Please ensure the file is clear and readable</li>
            <li>• Include accurate information about the question paper</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
