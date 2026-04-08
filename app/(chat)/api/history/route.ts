import { auth } from "@/app/(auth)/auth";
import { ChatbotError } from "@/lib/errors";

// History is now handled client-side via sessionStorage
// This API returns empty data for compatibility

export async function GET() {
  const session = await auth();

  if (!session?.user) {
    return new ChatbotError("unauthorized:chat").toResponse();
  }

  // Return empty history - client uses sessionStorage
  return Response.json({ chats: [], hasMore: false });
}

export async function DELETE() {
  const session = await auth();

  if (!session?.user) {
    return new ChatbotError("unauthorized:chat").toResponse();
  }

  // No database to clear - client handles this
  return Response.json({ success: true }, { status: 200 });
}
