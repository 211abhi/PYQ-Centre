import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import UploadForm from "@/components/UploadForm";   // ✅ Your UploadForm
import Header from "@/components/Header";           // ✅ Your Header

export default async function UploadPage() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <>
            
      <UploadForm user={user} />     {/* ✅ pass user to UploadForm */}
    </>
  );
}
