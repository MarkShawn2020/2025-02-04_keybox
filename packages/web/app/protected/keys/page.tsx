import { EnvVarActions } from "@/components/env-var-actions";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function KeysPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-6 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Environment Variables</h1>
        <EnvVarActions />
      </div>
      
      <div className="grid gap-4">
        {/* TODO: Add KeysList component here */}
        <div className="text-sm text-muted-foreground">
          Your environment variables will be displayed here.
        </div>
      </div>
    </div>
  );
}
