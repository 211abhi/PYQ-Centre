import { getSupabaseAdmin } from '@/lib/supabaseAdmin';

// Simple admin verification for API routes
function isValidAdminRequest(request) {
  const adminAuth = request.headers.get('x-admin-auth');
  return adminAuth === 'admin-authenticated'; // Simple check for demo
}

export async function POST(request) {
  // Check admin authentication
  if (!isValidAdminRequest(request)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabaseAdmin = getSupabaseAdmin();
    const { paperId, action } = await request.json();

    if (!paperId || !action) {
      return Response.json({ error: 'Paper ID and action are required' }, { status: 400 });
    }

    let result;

    switch (action) {
      case 'approve':
        result = await supabaseAdmin
          .from('question_papers')
          .update({ approved: true })
          .eq('id', paperId);
        break;

      case 'reject':
        result = await supabaseAdmin
          .from('question_papers')
          .delete()
          .eq('id', paperId);
        break;

      case 'unapprove':
        result = await supabaseAdmin
          .from('question_papers')
          .update({ approved: false })
          .eq('id', paperId);
        break;

      default:
        return Response.json({ error: 'Invalid action' }, { status: 400 });
    }

    if (result.error) throw result.error;

    return Response.json({ success: true });
  } catch (error) {
    console.error('Error updating paper:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  // Check admin authentication
  if (!isValidAdminRequest(request)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabaseAdmin = getSupabaseAdmin();
    const paperId = params.paperId;
    const updateData = await request.json();

    // Validate required fields
    if (!updateData.subject || !updateData.university || !updateData.degree || !updateData.year) {
      return Response.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Validate year
    if (updateData.year < 1900 || updateData.year > 2099) {
      return Response.json({ error: 'Invalid year' }, { status: 400 });
    }

    // Update the paper
    const result = await supabaseAdmin
      .from('question_papers')
      .update({
        subject: updateData.subject.trim(),
        university: updateData.university.trim(),
        degree: updateData.degree.trim(),
        year: updateData.year
      })
      .eq('id', paperId);

    if (result.error) throw result.error;

    return Response.json({ success: true });
  } catch (error) {
    console.error('Error updating paper:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
