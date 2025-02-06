

import { deleteProject } from '@/server/actions/projects';


export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await deleteProject((await params).id);
    return Response.json({ success: true });
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
