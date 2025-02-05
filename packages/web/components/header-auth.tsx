'use client';

import { signOutAction } from "@/app/actions";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import Link from "next/link";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { createClient } from "@/utils/supabase/client";
import { useEffect } from 'react';
import { atom, useAtom } from 'jotai';
import { User } from '@supabase/supabase-js';

// 创建全局用户状态
export const userAtom = atom<User | null>(null);
export const userLoadingAtom = atom<boolean>(true);

export default function HeaderAuth() {
  const [user, setUser] = useAtom(userAtom);
  const [loading, setLoading] = useAtom(userLoadingAtom);

  useEffect(() => {
    const supabase = createClient();

    async function initializeAuth() {
      try {
        // 初始化用户状态
        const { data: { user } } = await supabase.auth.getUser();
        console.log('Current user:', user); // Debug log
        setUser(user);
        setLoading(false);

        // 监听认证状态变化
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
          console.log('Auth state changed:', event, session?.user); // Debug log
          if (event === 'SIGNED_IN') {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
          } else if (event === 'SIGNED_OUT') {
            setUser(null);
          }
          setLoading(false);
        });

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Auth initialization error:', error);
        setLoading(false);
      }
    }

    initializeAuth();
  }, [setUser, setLoading]);

  if (loading) {
    return <div>Loading...</div>;
  }


  if (!hasEnvVars) {
    return (
      <div className="flex gap-4 items-center">
        <div>
          <Badge
            variant={"default"}
            className="font-normal pointer-events-none"
          >
            Please update .env.local file with anon key and url
          </Badge>
        </div>
        <div className="flex gap-2">
          <Button
            asChild
            size="sm"
            variant={"outline"}
            disabled
            className="opacity-75 cursor-none pointer-events-none"
          >
            <Link href="/sign-in">Sign in</Link>
          </Button>
          <Button
            asChild
            size="sm"
            variant={"default"}
            disabled
            className="opacity-75 cursor-none pointer-events-none"
          >
            <Link href="/sign-up">Sign up</Link>
          </Button>
        </div>
      </div>
    );
  }

  return user ? (
    <div className="flex items-center gap-4">
      <form action={signOutAction}>
        <Button type="submit" size="sm">
          Logout
        </Button>
      </form>
    </div>
  ) : (
    <div className="flex items-center gap-2">
      <Button asChild size="sm" variant="outline">
        <Link href="/sign-in">Login</Link>
      </Button>
      <Button asChild size="sm">
        <Link href="/sign-up">Sign Up</Link>
      </Button>
    </div>
  );
}
