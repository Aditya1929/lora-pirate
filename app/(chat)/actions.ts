"use server";

import { generateText, type UIMessage } from "ai";
import { cookies } from "next/headers";
import type { VisibilityType } from "@/components/visibility-selector";
import { titlePrompt } from "@/lib/ai/prompts";
import { getTitleModel } from "@/lib/ai/providers";
import { getTextFromMessage } from "@/lib/utils";

export async function saveChatModelAsCookie(model: string) {
  const cookieStore = await cookies();
  cookieStore.set("chat-model", model);
}

export async function generateTitleFromUserMessage({
  message,
}: {
  message: UIMessage;
}) {
  const { text } = await generateText({
    model: getTitleModel(),
    system: titlePrompt,
    prompt: getTextFromMessage(message),
  });
  return text
    .replace(/^[#*"\s]+/, "")
    .replace(/["]+$/, "")
    .trim();
}

// Stubbed - no database to delete from (client handles this)
export async function deleteTrailingMessages({ id }: { id: string }) {
  // No-op: Client-side storage handles message deletion
  console.log("deleteTrailingMessages called with id:", id);
}

// Stubbed - no database to update (visibility is handled client-side)
export async function updateChatVisibility({
  chatId,
  visibility,
}: {
  chatId: string;
  visibility: VisibilityType;
}) {
  // No-op: Client-side storage handles visibility
  console.log("updateChatVisibility called:", { chatId, visibility });
}
