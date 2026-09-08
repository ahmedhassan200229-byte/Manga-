import { db } from "@/db";
import { comments } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await db
    .update(comments)
    .set({ likes: sql`${comments.likes} + 1` })
    .where(eq(comments.id, Number(id)));
  return Response.json({ ok: true });
}
