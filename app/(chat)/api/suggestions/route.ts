import { auth } from "@/app/(auth)/auth";
import { ChatbotError } from "@/lib/errors";

// Suggestions are not persisted without a database
// Return empty array for UI compatibility

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const documentId = searchParams.get("documentId");

  if (!documentId) {
    return new ChatbotError(
      "bad_request:api",
      "Parameter documentId is required."
    ).toResponse();
  }

  const session = await auth();

  if (!session?.user) {
    return new ChatbotError("unauthorized:suggestions").toResponse();
  }

  // Return empty suggestions - not persisted without database
  return Response.json([], { status: 200 });
}
