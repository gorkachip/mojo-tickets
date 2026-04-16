"use client";

import { MessageSquareWarning, Bug, Lightbulb, ChevronRight } from "lucide-react";

type Category = "ai_response" | "app_bug" | "idea";

const categories: { id: Category; label: string; icon: React.ReactNode }[] = [
  {
    id: "ai_response",
    label: "AI response needs improvement",
    icon: <MessageSquareWarning className="h-5 w-5 text-[#49615B]" />,
  },
  {
    id: "app_bug",
    label: "App or automation didn't work as expected",
    icon: <Bug className="h-5 w-5 text-[#49615B]" />,
  },
  {
    id: "idea",
    label: "Got an idea to improve the chatbot",
    icon: <Lightbulb className="h-5 w-5 text-[#49615B]" />,
  },
];

export function WidgetPopup({
  onSelect,
}: {
  onSelect: (category: Category) => void;
}) {
  return (
    <div className="fixed bottom-24 right-6 z-50 w-[360px] rounded-2xl border border-[#E5DAD0] bg-[#FCF9F6] shadow-2xl">
      <div className="p-6">
        <div className="mb-1 flex h-10 w-10 items-center justify-center rounded-lg bg-[#27241E]">
          <svg
            className="h-5 w-5 text-[#FCF9F6]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </div>
        <h2 className="mt-3 font-[family-name:var(--font-lacquer)] text-xl text-[#27241E]">
          Welcome
        </h2>
        <p className="text-lg font-bold text-[#27241E]">How can we help?</p>
      </div>

      <div className="border-t border-[#E5DAD0] px-6 py-3">
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-[#BBAC9D]">
          Submit a ticket
        </p>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className="flex w-full items-center gap-3 rounded-lg px-2 py-3 text-left text-sm text-[#27241E] transition-colors hover:bg-[#E5DAD0]/40"
          >
            {cat.icon}
            <span className="flex-1">{cat.label}</span>
            <ChevronRight className="h-4 w-4 text-[#BBAC9D]" />
          </button>
        ))}
      </div>

      <div className="border-t border-[#E5DAD0] py-3 text-center">
        <span className="font-[family-name:var(--font-lacquer)] text-xs text-[#BBAC9D]">
          MOJO
        </span>
      </div>
    </div>
  );
}
