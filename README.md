# 📚 PYQ Centre - Previous Year Questions Platform

A modern, responsive web platform for sharing and accessing Previous Year Questions (PYQ) papers for academic purposes. Built with Next.js, Supabase, and Tailwind CSS.

![PYQ Centre Platform](https://img.shields.io/badge/Next.js-15.3.5-black?style=for-the-badge&logo=next.js)
![Supabase](https://img.shields.io/badge/Supabase-Database-green?style=for-the-badge&logo=supabase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-blue?style=for-the-badge&logo=tailwindcss)

## ✨ Features

### 🔍 **Public Search**
- Browse and search approved question papers
- Filter by subject, year, university, and exam type
- Download papers with a single click
- Responsive design for all devices

### 📤 **Upload System**
- Secure file upload for authenticated users
- Support for PDF documents
- Metadata collection (subject, year, university, etc.)
- Real-time upload progress and status

### 🛡️ **Admin Panel**
- Secure admin authentication system
- Review and approve/reject uploaded papers
- Dashboard with statistics and insights
- Bulk paper management tools

### 🎨 **Modern UI/UX**
- Dark/Light mode toggle
- Responsive design (mobile-first)
- Beautiful card-based layouts
- Intuitive navigation and search

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- Supabase account and project
- Git installed

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/211abhi/pyq-centre.git
   cd pyq-centre
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your Supabase credentials in `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

4. **Set up Supabase database**
   - Run the SQL commands from `supabase_rls_policies.sql` in your Supabase SQL editor
   - Create the `question_papers` table with appropriate columns

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
pyq-centre/
├── src/
│   ├── app/
│   │   ├── admin/           # Admin panel pages
│   │   ├── api/             # API routes
│   │   ├── upload/          # Upload page
│   │   └── ...
│   ├── components/
│   │   ├── Header.js        # Navigation header
│   │   ├── SearchPapers.js  # Public search component
│   │   ├── UploadForm.js    # File upload form
│   │   └── AdminDashboard.js # Admin management
│   └── lib/
│       ├── supabaseClient.js    # Public Supabase client
│       └── supabaseAdmin.js     # Admin Supabase client
├── public/
│   ├── logo_light.png       # Light mode logo
│   └── logo_dark.png        # Dark mode logo
└── supabase_rls_policies.sql
```

## 🔧 Configuration

### Supabase Setup

1. **Create a new Supabase project**
2. **Set up the database table:**
   ```sql
   CREATE TABLE question_papers (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     title TEXT NOT NULL,
     subject TEXT NOT NULL,
     year INTEGER NOT NULL,
     university TEXT NOT NULL,
     exam_type TEXT NOT NULL,
     file_url TEXT NOT NULL,
     file_name TEXT NOT NULL,
     uploader_id UUID REFERENCES auth.users(id),
     approved BOOLEAN DEFAULT false,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
   );
   ```

3. **Apply Row Level Security policies** (from `supabase_rls_policies.sql`)


## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Add environment variables** in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`



## 🎯 Usage

### For Students
1. Visit the homepage to search papers
2. Use filters to find specific papers
3. Download papers directly
4. Sign up to upload your own papers

### For Contributors
1. Sign in with Google/GitHub
2. Upload question papers via the Upload page
3. Wait for admin approval
4. Papers appear in public search once approved


## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the React framework
- [Supabase](https://supabase.com/) for backend and authentication
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Vercel](https://vercel.com/) for deployment platform



- **Project Link**: [https://github.com/211abhi/pyq-centre](https://github.com/211abhi/pyq-centre)
- **Live Demo**: [https://pyq-centre.vercel.app](https://pyq-centre.vercel.app)

---

Made with ❤️ for the academic community
