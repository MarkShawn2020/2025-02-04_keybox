import Logo from "@/components/logo";
import { createClient } from "@/utils/supabase/server";
import { Button } from "@/components/ui/button";
import { ArrowRight, Key, Lock, Users, Zap } from "lucide-react";
import Link from "next/link";

// Feature Card Component
const FeatureCard = ({ icon: Icon, title, description }: { icon: any, title: string, description: string }) => (
  <div className="group relative flex flex-col gap-4 p-6 rounded-lg border border-border/50 hover:border-primary/50 transition-all duration-300 bg-background/60 backdrop-blur-sm hover:shadow-[0_0_15px_rgba(0,0,0,0.1)]">
    <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/10 via-background to-background rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    <div className="p-2 w-fit rounded-lg bg-primary/10 ring-1 ring-primary/20 group-hover:ring-primary/30 group-hover:bg-primary/20 transition-all duration-300">
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
    <div className="flex flex-col items-center text-center gap-8 max-w-5xl px-4">
      <div className="relative flex items-center gap-2 text-sm px-4 py-2 bg-muted/50 rounded-full backdrop-blur-sm border border-border/50">
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-primary/10 via-background/50 to-primary/10 rounded-full animate-gradient" />
        <span className="px-2 py-1 bg-primary text-primary-foreground rounded-full text-xs font-medium animate-pulse">
          New
        </span>
        <span className="text-muted-foreground">现已支持团队协作和权限管理</span>
      </div>
      
      <div className="relative">
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-primary/20 to-primary/20 blur-2xl opacity-50 animate-pulse" />
        <Logo mode="svg" className="w-[200px] h-auto" color="currentColor" />
      </div>

      <div className="space-y-4">
        <h1 className="text-4xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70">
          下一代
          <span className="text-primary animate-text-gradient bg-gradient-to-r from-primary via-primary/80 to-primary bg-[length:200%_auto] motion-safe:animate-gradient"> 环境变量 </span>
          管理系统
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          安全、高效地管理和共享环境变量。支持命令行同步、多值变量，让配置管理变得简单。
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <Link href="/sign-in">
          <Button 
            size="lg" 
            className="w-full sm:w-auto gap-2 bg-gradient-to-r from-primary to-primary hover:from-primary/90 hover:to-primary relative overflow-hidden group"
          >
            <span className="absolute inset-0 bg-[image:radial-gradient(circle_at_center,_theme(colors.primary.foreground)_0%,_transparent_75%)] opacity-0 transition-opacity group-hover:opacity-10" />
            立即开始使用 <ArrowRight className="w-4 h-4 animate-bounce-x" />
          </Button>
        </Link>
        {/* <Link href="/docs">
          <Button 
            size="lg" 
            variant="outline" 
            className="w-full sm:w-auto relative overflow-hidden group border-primary/30 hover:border-primary/50"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            了解更多
          </Button>
        </Link> */}
      </div>
    </div>

    {/* Features Section */}
    <div className="w-full max-w-6xl px-4">
      <div className="relative grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-primary/5 to-background blur-3xl opacity-50" />

        <FeatureCard
          icon={Zap}
          title="CLI 自动集成"
          description="基于项目角色智能生成环境变量文件，支持多种格式导出。无缝对接开发工作流，提升团队效率。"
        />

        <FeatureCard
          icon={Key}
          title="多值变量管理"
          description="突破传统限制，支持同一变量维护多个值版本。灵活切换不同环境配置，简化开发和部署流程。"
        />

<FeatureCard
          icon={Lock}
          title="零信任加密"
          description="采用端到端加密技术，确保环境变量的绝对安全。支持密钥轮换和访问审计，满足企业级安全标准。"
        />

        <FeatureCard
          icon={Users}
          title="开源私有部署"
          description="完全开源，支持一键私有化部署。掌控数据主权，按需定制功能，打造专属配置管理平台。"
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
