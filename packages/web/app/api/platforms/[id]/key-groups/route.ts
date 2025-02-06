
import { createKeyGroup } from '@/server/actions/keys';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const data = await request.json();
    const id = (await params).id;
    await createKeyGroup(id, data);
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
