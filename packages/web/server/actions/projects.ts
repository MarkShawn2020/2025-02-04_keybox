'use server'
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { ProjectWithKeys } from '@keybox/shared';

export async function getProjectKeys(name: string) {
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

  // Get all projects for the user
  const { data: projects, error: projectError } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', user.id);

  if (projectError) throw projectError;
  if (!projects) return [];

  type ProjectKeyJoin = {
    project_id: string;
    keys: {
      value: string;
    };
  };

  // Get all project keys
  const { data: projectKeys, error: keysError } = await supabase
    .from('project_keys')
    .select(`
      project_id,
      keys!inner(
        value
      )
    `) as unknown as { data: ProjectKeyJoin[] | null; error: Error | null };

  if (keysError) throw keysError;

  // Map projects to ProjectWithKeys
  return projects.map(project => ({
    ...project,
    keys: projectKeys
      ?.filter(key => key.project_id === project.id)
      ?.map(key => key.keys.value) || []
  })) as ProjectWithKeys[];
}

export async function createProject(data: ProjectWithKeys) {
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

  // Start a transaction
  const { data: project, error: projectError } = await supabase
    .from('projects')
    .insert({
      name: data.name,
      description: data.description,
      user_id: user.id,
    })
    .select()
    .single();

  if (projectError) throw projectError;

  // Add keys if provided
  if (data.keys && data.keys.length > 0) {
    const { error: keysError } = await supabase
      .from('project_keys')
      .insert(
        data.keys.map((key) => ({
          project_id: project.id,
          key_id: key,
        }))
      );

    if (keysError) throw keysError;
  }

  return project;
}

export async function deleteProject(id: string) {
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

  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) throw error;
  return { success: true };
}
