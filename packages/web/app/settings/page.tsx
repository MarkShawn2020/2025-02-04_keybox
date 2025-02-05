import { Suspense } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Key, Lock, User } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

// Profile Settings Section
const ProfileSettings = async () => {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email">邮箱地址</Label>
        <Input
          id="email"
          type="email"
          value={user.email}
          disabled
          className="max-w-md"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">显示名称</Label>
        <Input
          id="name"
          type="text"
          placeholder="请输入您的名称"
          className="max-w-md"
        />
      </div>

      <Button>保存更改</Button>
    </div>
  );
};

// Security Settings Section
const SecuritySettings = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between max-w-md">
      <div className="space-y-0.5">
        <Label>双因素认证</Label>
        <div className="text-sm text-muted-foreground">
          启用双因素认证以提高账户安全性
        </div>
      </div>
      <Switch />
    </div>

    <div className="space-y-2">
      <Label htmlFor="current-password">当前密码</Label>
      <Input
        id="current-password"
        type="password"
        className="max-w-md"
      />
    </div>

    <div className="space-y-2">
      <Label htmlFor="new-password">新密码</Label>
      <Input
        id="new-password"
        type="password"
        className="max-w-md"
      />
    </div>

    <Button>更新密码</Button>
  </div>
);

// Notification Settings Section
const NotificationSettings = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between max-w-md">
      <div className="space-y-0.5">
        <Label>邮件通知</Label>
        <div className="text-sm text-muted-foreground">
          接收关于环境变量更新的邮件通知
        </div>
      </div>
      <Switch defaultChecked />
    </div>

    <div className="flex items-center justify-between max-w-md">
      <div className="space-y-0.5">
        <Label>安全警报</Label>
        <div className="text-sm text-muted-foreground">
          接收关于安全事件的即时通知
        </div>
      </div>
      <Switch defaultChecked />
    </div>

    <div className="flex items-center justify-between max-w-md">
      <div className="space-y-0.5">
        <Label>团队动态</Label>
        <div className="text-sm text-muted-foreground">
          接收关于团队成员活动的通知
        </div>
      </div>
      <Switch />
    </div>
  </div>
);

// Settings Page Component
export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">设置</h2>
        <p className="text-muted-foreground">
          管理您的账户设置和偏好
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-4 w-4" />
            个人资料
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Lock className="h-4 w-4" />
            安全设置
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            通知设置
          </TabsTrigger>
        </TabsList>

        <Card className="p-6">
          <TabsContent value="profile" className="mt-0">
            <Suspense fallback={<div>加载中...</div>}>
              <ProfileSettings />
            </Suspense>
          </TabsContent>

          <TabsContent value="security" className="mt-0">
            <SecuritySettings />
          </TabsContent>

          <TabsContent value="notifications" className="mt-0">
            <NotificationSettings />
          </TabsContent>
        </Card>
      </Tabs>
    </div>
  );
}
