

import { createProject } from '@/server/actions/projects';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const project = await createProject(data);
    return Response.json(project);
  } catch (error: any) {
    if (error.message === 'Not authenticated') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return Response.json(
      { error: error.message },
      { status: error.status || 500 }
    );
  }
}
