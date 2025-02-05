import Logo from "@/components/logo";
import { createClient } from "@/utils/supabase/server";
import { Button } from "@/components/ui/button";
import { ArrowRight, Key, Lock, Users, Zap } from "lucide-react";
import Link from "next/link";

// Feature Card Component
const FeatureCard = ({ icon: Icon, title, description }: { icon: any, title: string, description: string }) => (
  <div className="flex flex-col gap-4 p-6 bg-card rounded-lg border border-border/50 hover:border-border/80 transition-colors">
    <div className="p-2 w-fit rounded-lg bg-primary/10">
      <Icon className="w-6 h-6 text-primary" />
    </div>
    <h3 className="text-xl font-semibold">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </div>
);

// Landing Page Component
const LandingPage = () => (
  <div className="flex flex-col items-center justify-center gap-20 py-20">
    {/* Hero Section */}
    <div className="flex flex-col items-center text-center gap-8 max-w-3xl px-4">
      <div className="flex items-center gap-2 text-sm px-4 py-2 bg-muted rounded-full">
        <span className="px-2 py-1 bg-primary text-primary-foreground rounded-full text-xs font-medium">New</span>
        <span className="text-muted-foreground">现已支持团队协作和权限管理</span>
      </div>
      
      <Logo mode="svg" className="w-[180px] h-auto" color="currentColor" />
      <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
        现代化的
        <span className="text-primary"> 环境变量 </span>
        管理系统
      </h1>
      <p className="text-xl text-muted-foreground max-w-2xl">
        安全、高效地管理和共享环境变量。支持团队协作、版本控制和自动同步，让配置管理变得简单。
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/auth/sign-up">
          <Button size="lg" className="w-full sm:w-auto gap-2">
            免费开始使用 <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
        <Link href="/docs">
          <Button size="lg" variant="outline" className="w-full sm:w-auto">
            了解更多
          </Button>
        </Link>
      </div>
    </div>

    {/* Features Section */}
    <div className="w-full max-w-5xl px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FeatureCard
          icon={Lock}
          title="安全加密存储"
          description="使用强加密算法存储环境变量，确保数据安全。支持细粒度的访问控制和审计日志。"
        />
        <FeatureCard
          icon={Users}
          title="团队协作"
          description="基于角色的访问控制，轻松管理团队成员权限。支持多环境配置和变量共享。"
        />
        <FeatureCard
          icon={Key}
          title="版本控制"
          description="追踪环境变量的变更历史，随时回滚到之前的版本。支持变量模板和批量操作。"
        />
        <FeatureCard
          icon={Zap}
          title="CI/CD 集成"
          description="与主流 CI/CD 平台无缝集成，自动同步环境变量。支持 Webhook 和 API 接口。"
        />
      </div>
    </div>
  </div>
);

// Dashboard Component
const Dashboard = () => (
  <div className="flex flex-col gap-8 p-8">
    {/* Welcome Section */}
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold">欢迎使用 KeyBox</h1>
      <p className="text-muted-foreground">从下方选择一个操作开始</p>
    </div>

    {/* Quick Actions */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Link href="/variables" className="group">
        <div className="p-6 rounded-lg border border-border/50 group-hover:border-border/80 transition-all bg-card hover:shadow-sm">
          <h3 className="font-semibold flex items-center gap-2 mb-2">
            <Key className="w-5 h-5" /> 创建环境变量
          </h3>
          <p className="text-sm text-muted-foreground">添加新的环境变量或从文件导入</p>
        </div>
      </Link>
      <Link href="/projects" className="group">
        <div className="p-6 rounded-lg border border-border/50 group-hover:border-border/80 transition-all bg-card hover:shadow-sm">
          <h3 className="font-semibold flex items-center gap-2 mb-2">
            <Users className="w-5 h-5" /> 管理解决方案
          </h3>
          <p className="text-sm text-muted-foreground">查看和管理您的解决方案</p>
        </div>
      </Link>
      <Link href="/settings" className="group">
        <div className="p-6 rounded-lg border border-border/50 group-hover:border-border/80 transition-all bg-card hover:shadow-sm">
          <h3 className="font-semibold flex items-center gap-2 mb-2">
            <Lock className="w-5 h-5" /> 安全设置
          </h3>
          <p className="text-sm text-muted-foreground">管理访问权限和安全选项</p>
        </div>
      </Link>
    </div>
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
