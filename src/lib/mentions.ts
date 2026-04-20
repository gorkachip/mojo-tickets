import { prisma } from "@/lib/prisma";

export function extractMentions(text: string | null): string[] {
  if (!text) return [];
  const matches = text.matchAll(/@(\w+)/g);
  const usernames = new Set<string>();
  for (const m of matches) {
    usernames.add(m[1].toLowerCase());
  }
  return Array.from(usernames);
}

export async function recordMentions(
  actionId: string,
  ticketId: string,
  comment: string | null,
) {
  const mentioned = extractMentions(comment);
  if (mentioned.length === 0) return;

  const validUsers = await prisma.user.findMany({
    where: { username: { in: mentioned } },
    select: { username: true },
  });
  const validUsernames = validUsers.map((u) => u.username);
  if (validUsernames.length === 0) return;

  await prisma.ticketMention.createMany({
    data: validUsernames.map((username) => ({
      actionId,
      ticketId,
      mentionedUsername: username,
    })),
  });
}
