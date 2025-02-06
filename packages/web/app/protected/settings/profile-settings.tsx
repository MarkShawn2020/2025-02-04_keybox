'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { User } from '@supabase/supabase-js';

export function ProfileSettings() {
  const client = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState("");

  useEffect(() => {
    const loadUser = async () => {
      const { data: { user } } = await client.auth.getUser();
      setUser(user);
    };
    loadUser();
  }, [client]);

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
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="请输入您的名称"
          className="max-w-md"
        />
      </div>

      <Button>保存更改</Button>
    </div>
  );
}
