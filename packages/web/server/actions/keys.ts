'use server'
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { parse as parseEnv } from 'dotenv';

import { createPlatformSchema, createKeyGroupSchema, createKeySchema, keyGroupSchema } from '@keybox/shared';

export async function listKeys() {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async get(name: string) {
          const cookieStore = await cookies();
          const cookie = await cookieStore.get(name);
          return cookie?.value;
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('Not authenticated');
  }

  const { data: platforms, error } = await supabase
    .from('platforms')
    .select(`
      id,
      name,
      description,
      tags,
      created_at,
      updated_at,
      key_groups:key_groups(
        id,
        name,
        description,
        created_at,
        updated_at,
        tags,
        keys:keys(
          id,
          value,
          note,
          revoked,
          created_at,
          updated_at
        )
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return platforms;
}

export async function createPlatform(data: any) {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async get(name: string) {
          const cookieStore = await cookies();
          const cookie = await cookieStore.get(name);
          return cookie?.value;
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('Not authenticated');
  }

  const validatedData = createPlatformSchema.parse(data);
  const { error } = await supabase
    .from('platforms')
    .insert({ ...validatedData, user_id: user.id });

  if (error) throw error;
  return { success: true };
}

export async function createKeyGroup(platformId: string, data: any) {
  console.log('Creating key group with platformId:', platformId);
  console.log('Data:', data);

  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async get(name: string) {
          const cookieStore = await cookies();
          const cookie = await cookieStore.get(name);
          return cookie?.value;
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('Not authenticated');
  }
  console.log('Current user:', user.id);

  // 验证 platformId
  const { data: platform, error: platformError } = await supabase
    .from('platforms')
    .select('id, user_id')
    .eq('id', platformId)
    .single();

  console.log('Platform query result:', { platform, error: platformError });

  if (platformError) {
    console.error('Platform error:', platformError);
    throw new Error(`Platform error: ${platformError.message}`);
  }

  if (!platform) {
    throw new Error('Platform not found');
  }

  if (platform.user_id !== user.id) {
    throw new Error('Access denied: platform belongs to another user');
  }

  const validatedData = createKeyGroupSchema.parse(data);
  console.log('Validated data:', validatedData);

  const { error } = await supabase
    .from('key_groups')
    .insert({
      ...validatedData,
      platform_id: platformId,
      user_id: user.id
    });

  if (error) {
    console.error('Error creating key group:', error);
    throw error;
  }

  console.log('Key group created successfully');
  return { success: true };
}

export async function createKey(groupId: string, data: any) {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async get(name: string) {
          const cookieStore = await cookies();
          const cookie = await cookieStore.get(name);
          return cookie?.value;
        },
      },
    }
  );

  const validatedData = createKeySchema.parse(data);
  const { error } = await supabase
    .from('keys')
    .insert({ ...validatedData, key_group_id: groupId });

  if (error) throw error;
  return { success: true };
}

export async function deleteKey(id: string) {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async get(name: string) {
          const cookieStore = await cookies();
          const cookie = await cookieStore.get(name);
          return cookie?.value;
        },
      },
    }
  );

  const { error } = await supabase
    .from('keys')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return { success: true };
}

export async function importEnvFile(content: string) {
  try {
    const env = parseEnv(content);
    return { env };
  } catch (error: any) {
    throw new Error(`Failed to parse .env file: ${error.message}`);
  }
}

export async function exportEnvFile(env: Record<string, string>) {
  try {
    return JSON.stringify(env, null, 2);
  } catch (error: any) {
    throw new Error(`Failed to stringify env: ${error.message}`);
  }
}

export async function updateKeyGroup(groupId: string, data: any) {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async get(name: string) {
          const cookieStore = await cookies();
          const cookie = await cookieStore.get(name);
          return cookie?.value;
        },
      },
    }
  );

  const validatedData = keyGroupSchema.omit({ id: true, created_at: true, updated_at: true, keys: true }).parse(data);
  const { error } = await supabase
    .from('key_groups')
    .update(validatedData)
    .eq('id', groupId);

  if (error) throw error;
  return { success: true };
}

export async function updateKeyNote(keyId: string, note: string) {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async get(name: string) {
          const cookieStore = await cookies();
          const cookie = await cookieStore.get(name);
          return cookie?.value;
        },
      },
    }
  );

  const { error } = await supabase
    .from('keys')
    .update({ note })
    .eq('id', keyId);

  if (error) throw error;
  return { success: true };
}

export async function toggleKeyStatus(keyId: string) {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async get(name: string) {
          const cookieStore = await cookies();
          const cookie = await cookieStore.get(name);
          return cookie?.value;
        },
      },
    }
  );

  // First get the current status
  const { data: key, error: fetchError } = await supabase
    .from('keys')
    .select('revoked')
    .eq('id', keyId)
    .single();

  if (fetchError) throw fetchError;
  if (!key) throw new Error('Key not found');

  // Toggle the status
  const { error: updateError } = await supabase
    .from('keys')
    .update({ revoked: !key.revoked })
    .eq('id', keyId);

  if (updateError) throw updateError;
  return { success: true };
}

export async function deletePlatform(platformId: string) {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async get(name: string) {
          const cookieStore = await cookies();
          const cookie = await cookieStore.get(name);
          return cookie?.value;
        },
      },
    }
  );

  const { error } = await supabase
    .from('platforms')
    .delete()
    .eq('id', platformId);

  if (error) throw error;
  return { success: true };
}
