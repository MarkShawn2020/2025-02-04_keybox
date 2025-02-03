import Logo from "@/components/logo";
import { EnvVarActions } from "@/components/env-var-actions";
import { KeysList } from "@/components/keys-list";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

// Landing Page Component
const LandingPage = () => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <Logo mode="svg" className="w-[180px] h-auto" color="currentColor" />
    <h1 className="text-4xl font-bold m-4">EnvBox</h1>
    <p className="text-xl text-muted-foreground">现代化的环境变量管理系统</p>
  </div>
);

// Dashboard Component
const Dashboard = () => (
  <div className="flex flex-col gap-8 p-8">
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold">环境变量管理</h1>
      <EnvVarActions />
    </div>
    <KeysList />
  </div>
);

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return <LandingPage />;
  }

  return (
    <main className="flex-1 w-full">
      <Dashboard />
    </main>
  );
}
