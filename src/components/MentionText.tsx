export function MentionText({ text }: { text: string }) {
  const parts = text.split(/(@\w+)/g);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith("@") ? (
          <span
            key={i}
            className="rounded bg-[#49615B]/15 px-1 py-0.5 font-medium text-[#49615B]"
          >
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}
