import { getSupabaseAdmin } from '@/lib/supabaseAdmin';

// Simple admin verification for API routes
function isValidAdminRequest(request) {
  const adminAuth = request.headers.get('x-admin-auth');
  return adminAuth === 'admin-authenticated'; // Simple check for demo
}

export async function GET(request) {
  // Check admin authentication
  if (!isValidAdminRequest(request)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabaseAdmin = getSupabaseAdmin();
    
    // Get all papers with admin privileges (bypasses RLS)
    const { data: papers, error } = await supabaseAdmin
      .from('question_papers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Calculate stats
    const stats = {
      total: papers.length,
      pending: papers.filter(paper => !paper.approved).length,
      approved: papers.filter(paper => paper.approved).length,
      rejected: 0 // You can add a rejected status field later
    };

    return Response.json({ papers, stats });
  } catch (error) {
    console.error('Error fetching admin data:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
