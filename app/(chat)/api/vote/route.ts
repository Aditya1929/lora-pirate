import { auth } from "@/app/(auth)/auth";
import { ChatbotError } from "@/lib/errors";

// Votes are not persisted without a database
// These endpoints return success for UI compatibility

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const chatId = searchParams.get("chatId");

  if (!chatId) {
    return new ChatbotError(
      "bad_request:api",
      "Parameter chatId is required."
    ).toResponse();
  }

  const session = await auth();

  if (!session?.user) {
    return new ChatbotError("unauthorized:vote").toResponse();
  }

  // Return empty votes - not persisted without database
  return Response.json([], { status: 200 });
}

export async function PATCH(request: Request) {
  const {
    chatId,
    messageId,
    type,
  }: { chatId: string; messageId: string; type: "up" | "down" } =
    await request.json();

  if (!chatId || !messageId || !type) {
    return new ChatbotError(
      "bad_request:api",
      "Parameters chatId, messageId, and type are required."
    ).toResponse();
  }

  const session = await auth();

  if (!session?.user) {
    return new ChatbotError("unauthorized:vote").toResponse();
  }

  // Vote not persisted but return success for UI feedback
  return new Response("Message voted", { status: 200 });
}
