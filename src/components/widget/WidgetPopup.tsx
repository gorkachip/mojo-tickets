"use client";

import { MessageSquareWarning, Bug, Lightbulb, ChevronRight } from "lucide-react";

type Category = "ai_response" | "app_bug" | "idea";

const categories: { id: Category; label: string; icon: React.ReactNode }[] = [
  {
    id: "ai_response",
    label: "AI response needs improvement",
    icon: <MessageSquareWarning className="h-5 w-5 text-gray-500" />,
  },
  {
    id: "app_bug",
    label: "App or automation didn't work as expected",
    icon: <Bug className="h-5 w-5 text-gray-500" />,
  },
  {
    id: "idea",
    label: "Got an idea to improve the chatbot",
    icon: <Lightbulb className="h-5 w-5 text-gray-500" />,
  },
];

export function WidgetPopup({
  onSelect,
}: {
  onSelect: (category: Category) => void;
}) {
  return (
    <div className="fixed bottom-24 right-6 z-50 w-[360px] rounded-2xl border border-gray-100 bg-white shadow-2xl">
      <div className="p-6">
        <div className="mb-1 flex h-10 w-10 items-center justify-center rounded-lg bg-[#1a1a2e]">
          <svg
            className="h-5 w-5 text-white"
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
        <h2 className="mt-3 text-xl font-bold text-gray-900">Welcome</h2>
        <p className="text-xl font-bold text-gray-900">How can we help?</p>
      </div>

      <div className="border-t border-gray-100 px-6 py-3">
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-gray-400">
          Submit a ticket
        </p>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className="flex w-full items-center gap-3 rounded-lg px-2 py-3 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50"
          >
            {cat.icon}
            <span className="flex-1">{cat.label}</span>
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </button>
        ))}
      </div>

      <div className="border-t border-gray-100 py-3 text-center">
        <span className="text-xs text-gray-400">Powered by MOJO</span>
      </div>
    </div>
  );
}
