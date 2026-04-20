"use client";

import { useEffect, useRef, useState } from "react";

type User = { username: string; name: string };

export function MentionTextarea({
  value,
  onChange,
  placeholder,
  rows = 4,
  users,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
  users: User[];
}) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [suggest, setSuggest] = useState<User[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [mentionStart, setMentionStart] = useState<number | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const newVal = e.target.value;
    onChange(newVal);
    const caret = e.target.selectionStart;
    const upto = newVal.slice(0, caret);
    const match = upto.match(/@(\w*)$/);
    if (match) {
      const start = caret - match[0].length;
      setMentionStart(start);
      const q = match[1].toLowerCase();
      const filtered = users
        .filter((u) => u.username.toLowerCase().startsWith(q))
        .slice(0, 5);
      setSuggest(filtered);
      setActiveIdx(0);
    } else {
      setSuggest([]);
      setMentionStart(null);
    }
  }

  function pick(u: User) {
    if (mentionStart === null || !ref.current) return;
    const before = value.slice(0, mentionStart);
    const after = value.slice(ref.current.selectionStart);
    const newVal = `${before}@${u.username} ${after}`;
    onChange(newVal);
    setSuggest([]);
    setMentionStart(null);
    setTimeout(() => {
      if (ref.current) {
        const pos = before.length + u.username.length + 2;
        ref.current.focus();
        ref.current.setSelectionRange(pos, pos);
      }
    }, 0);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (suggest.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => (i + 1) % suggest.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => (i - 1 + suggest.length) % suggest.length);
    } else if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault();
      pick(suggest[activeIdx]);
    } else if (e.key === "Escape") {
      setSuggest([]);
    }
  }

  useEffect(() => {
    if (suggest.length === 0) return;
    function onClick() {
      setSuggest([]);
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [suggest.length]);

  return (
    <div className="relative">
      <textarea
        ref={ref}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        rows={rows}
        placeholder={placeholder}
        className="w-full rounded-lg border border-[#E5DAD0] px-3 py-2 text-sm text-[#27241E] outline-none focus:border-[#49615B] focus:ring-1 focus:ring-[#49615B]"
      />
      {suggest.length > 0 && (
        <div
          className="absolute z-50 mt-1 w-56 rounded-lg border border-[#E5DAD0] bg-white shadow-lg"
          onClick={(e) => e.stopPropagation()}
        >
          {suggest.map((u, i) => (
            <button
              key={u.username}
              type="button"
              onClick={() => pick(u)}
              onMouseEnter={() => setActiveIdx(i)}
              className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm ${
                i === activeIdx ? "bg-[#FCF9F6]" : "bg-white"
              }`}
            >
              <span className="font-medium text-[#27241E]">@{u.username}</span>
              <span className="text-[#BBAC9D]">· {u.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
