export async function POST(request) {
  try {
    const { username, password } = await request.json();

    // Get admin credentials from environment variables
    const validAdmins = [
      {
        username: process.env.ADMIN1_USERNAME,
        password: process.env.ADMIN1_PASSWORD,
      },
      {
        username: process.env.ADMIN2_USERNAME,
        password: process.env.ADMIN2_PASSWORD,
      },
    ];

    // Check if provided credentials match any valid admin
    const isValidAdmin = validAdmins.some(
      (admin) => admin.username && admin.password && 
                 admin.username === username && admin.password === password
    );

    if (isValidAdmin) {
      return Response.json({ success: true });
    } else {
      return Response.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
    }
  } catch (error) {
    console.error('Admin auth error:', error);
    return Response.json({ success: false, error: 'Authentication failed' }, { status: 500 });
  }
}
