"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function AdminDashboard({ user, onLogout }) {
  const [pendingPapers, setPendingPapers] = useState([]);
  const [approvedPapers, setApprovedPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pending");
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });

  useEffect(() => {
    fetchPapers();
    fetchStats();
  }, []);

  const fetchPapers = async () => {
    try {
      setLoading(true);
      
      // Use secure API route with admin authentication
      const response = await fetch('/api/admin/papers', {
        headers: {
          'x-admin-auth': 'admin-authenticated'
        }
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.error);

      const pending = data.papers.filter(paper => !paper.approved);
      const approved = data.papers.filter(paper => paper.approved);

      setPendingPapers(pending);
      setApprovedPapers(approved);
      setStats(data.stats);
    } catch (error) {
      console.error("Error fetching papers:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    // Stats are now fetched with papers, so this can be empty
  };

  const handleApprove = async (paperId) => {
    try {
      const response = await fetch(`/api/admin/papers/${paperId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-auth': 'admin-authenticated'
        },
        body: JSON.stringify({ paperId, action: 'approve' }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      // Refresh data
      await fetchPapers();
      
      alert("Paper approved successfully!");
    } catch (error) {
      console.error("Error approving paper:", error);
      alert("Error approving paper: " + error.message);
    }
  };

  const handleReject = async (paperId) => {
    if (!confirm("Are you sure you want to delete this paper? This action cannot be undone.")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/papers/${paperId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-auth': 'admin-authenticated'
        },
        body: JSON.stringify({ paperId, action: 'reject' }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      // Refresh data
      await fetchPapers();
      
      alert("Paper rejected and deleted successfully!");
    } catch (error) {
      console.error("Error rejecting paper:", error);
      alert("Error rejecting paper: " + error.message);
    }
  };

  const handleUnapprove = async (paperId) => {
    try {
      const response = await fetch(`/api/admin/papers/${paperId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-auth': 'admin-authenticated'
        },
        body: JSON.stringify({ paperId, action: 'unapprove' }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      // Refresh data
      await fetchPapers();
      
      alert("Paper moved to pending review!");
    } catch (error) {
      console.error("Error updating paper:", error);
      alert("Error updating paper: " + error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-yellow-50 dark:bg-gray-800 py-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-yellow-50 dark:bg-gray-800 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Welcome back, {user.email}
            </p>
          </div>
          {onLogout && (
            <button
              onClick={onLogout}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-medium shadow-sm"
            >
              Logout
            </button>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Papers</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Review</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{stats.pending}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Approved</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{stats.approved}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Approval Rate</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                  {stats.total > 0 ? Math.round((stats.approved / stats.total) * 100) : 0}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab("pending")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "pending"
                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                Pending Review ({pendingPapers.length})
              </button>
              <button
                onClick={() => setActiveTab("approved")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "approved"
                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                Approved Papers ({approvedPapers.length})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === "pending" && (
              <div>
                {pendingPapers.length === 0 ? (
                  <div className="text-center py-8">
                    <svg className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No Pending Papers</h3>
                    <p className="text-gray-600 dark:text-gray-400">All papers have been reviewed!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingPapers.map((paper) => (
                      <div key={paper.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-gray-900 dark:text-gray-100">{paper.subject}</h3>
                              <span className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-xs font-medium px-2 py-1 rounded">
                                Pending
                              </span>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                              <div><strong>University:</strong> {paper.university}</div>
                              <div><strong>Degree:</strong> {paper.degree}</div>
                              <div><strong>Year:</strong> {paper.year}</div>
                              <div><strong>Uploaded:</strong> {new Date(paper.created_at).toLocaleDateString()}</div>
                            </div>
                            <a
                              href={paper.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                              View PDF
                            </a>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleApprove(paper.id)}
                              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(paper.id)}
                              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "approved" && (
              <div>
                {approvedPapers.length === 0 ? (
                  <div className="text-center py-8">
                    <svg className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No Approved Papers</h3>
                    <p className="text-gray-600 dark:text-gray-400">No papers have been approved yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {approvedPapers.map((paper) => (
                      <div key={paper.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-gray-900 dark:text-gray-100">{paper.subject}</h3>
                              <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs font-medium px-2 py-1 rounded">
                                Approved
                              </span>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                              <div><strong>University:</strong> {paper.university}</div>
                              <div><strong>Degree:</strong> {paper.degree}</div>
                              <div><strong>Year:</strong> {paper.year}</div>
                              <div><strong>Approved:</strong> {new Date(paper.created_at).toLocaleDateString()}</div>
                            </div>
                            <a
                              href={paper.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                              View PDF
                            </a>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleUnapprove(paper.id)}
                              className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                            >
                              Move to Pending
                            </button>
                            <button
                              onClick={() => handleReject(paper.id)}
                              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
