
import { deleteKey } from '@/server/actions/keys';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;
    await deleteKey(id);
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
