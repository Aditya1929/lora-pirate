import { auth } from "@/app/(auth)/auth";
import type { ArtifactKind } from "@/components/artifact";
import { ChatbotError } from "@/lib/errors";

// Documents are not persisted without a database
// These endpoints return minimal responses for UI compatibility

// In-memory store for documents (session-scoped, not persisted)
const documentsStore = new Map<string, {
  id: string;
  content: string;
  title: string;
  kind: ArtifactKind;
  userId: string;
  createdAt: Date;
}>();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return new ChatbotError(
      "bad_request:api",
      "Parameter id is missing"
    ).toResponse();
  }

  const session = await auth();

  if (!session?.user) {
    return new ChatbotError("unauthorized:document").toResponse();
  }

  const document = documentsStore.get(id);

  if (!document) {
    // Return empty array instead of error to allow document creation
    return Response.json([], { status: 200 });
  }

  if (document.userId !== session.user.id) {
    return new ChatbotError("forbidden:document").toResponse();
  }

  return Response.json([document], { status: 200 });
}

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return new ChatbotError(
      "bad_request:api",
      "Parameter id is required."
    ).toResponse();
  }

  const session = await auth();

  if (!session?.user) {
    return new ChatbotError("not_found:document").toResponse();
  }

  const {
    content,
    title,
    kind,
  }: { content: string; title: string; kind: ArtifactKind } =
    await request.json();

  // Store in memory (will be lost on server restart)
  const document = {
    id,
    content,
    title,
    kind,
    userId: session.user.id,
    createdAt: new Date(),
  };

  documentsStore.set(id, document);

  return Response.json(document, { status: 200 });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return new ChatbotError(
      "bad_request:api",
      "Parameter id is required."
    ).toResponse();
  }

  const session = await auth();

  if (!session?.user) {
    return new ChatbotError("unauthorized:document").toResponse();
  }

  const document = documentsStore.get(id);

  if (document && document.userId !== session.user.id) {
    return new ChatbotError("forbidden:document").toResponse();
  }

  documentsStore.delete(id);

  return Response.json({ deleted: true }, { status: 200 });
}
